Creating a Linera Project

To create your Linera project, use the linera project new command. The command should be executed outside the linera-protocol folder. It sets up the scaffolding and requisite files:

linera project new my-counter
linera project new bootstraps your project by creating the following key files:

Cargo.toml: your project's manifest filled with the necessary dependencies to create an app;
src/lib.rs: the application's ABI definition;
src/state.rs: the application's state;
src/contract.rs: the application's contract, and the binary target for the contract bytecode;
src/service.rs: the application's service, and the binary target for the service bytecode.
When writing Linera applications it is a convention to use your app's name as a prefix for names of trait, struct, etc. Hence, in the following manual, we will use CounterContract, CounterService, etc.

Creating the Application State

The state of a Linera application consists of onchain data that are persisted between transactions.

The struct which defines your application's state can be found in src/state.rs. To represent our counter, we're going to use a u64 integer.

While we could use a plain data-structure for the entire application state:

struct Counter {
  value: u64
}
in general, we prefer to manage persistent data using the concept of "views":

Views allow an application to load persistent data in memory and stage modifications in a flexible way.

Views resemble the persistent objects of an ORM framework, except that they are stored as a set of key-value pairs (instead of a SQL row).

In this case, the struct in src/state.rs should be replaced by

/// The application state.
#[derive(RootView, async_graphql::SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct Counter {
    pub value: RegisterView<u64>,
    // Additional fields here will get their own key in storage.
}
and the occurrences of Application in the rest of the project should be replaced by Counter.

The derive macro async_graphql::SimpleObject is related to GraphQL queries discussed in the next section.

A RegisterView<T> supports modifying a single value of type T. Other data structures available in the library linera_views include:

LogView for a growing vector of values;
QueueView for queues;
MapView and CollectionView for associative maps; specifically, MapView in the case of static values, and CollectionView when values are other views.
For an exhaustive list of the different constructions, refer to the crate documentation.
Defining the ABI

The Application Binary Interface (ABI) of a Linera application defines how to interact with this application from other parts of the system. It includes the data structures, data types, and functions exposed by on-chain contracts and services.

ABIs are usually defined in src/lib.rs and compiled across all architectures (Wasm and native).

For a reference guide, check out the documentation of the crate.

Defining a marker struct

The library part of your application (generally in src/lib.rs) must define a public empty struct that implements the Abi trait.

struct CounterAbi;
The Abi trait combines the ContractAbi and ServiceAbi traits to include the types that your application exports.

/// A trait that includes all the types exported by a Linera application (both contract
/// and service).
pub trait Abi: ContractAbi + ServiceAbi {}
Next, we're going to implement each of the two traits.

Contract ABI

The ContractAbi trait defines the data types that your application uses in a contract. Each type represents a specific part of the contract's behavior:

/// A trait that includes all the types exported by a Linera application contract.
pub trait ContractAbi {
    /// The type of operation executed by the application.
    ///
    /// Operations are transactions directly added to a block by the creator (and signer)
    /// of the block. Users typically use operations to start interacting with an
    /// application on their own chain.
    type Operation: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// The response type of an application call.
    type Response: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// How the `Operation` is deserialized
    fn deserialize_operation(operation: Vec<u8>) -> Result<Self::Operation, String> {
        bcs::from_bytes(&operation)
            .map_err(|e| format!("BCS deserialization error {e:?} for operation {operation:?}"))
    }

    /// How the `Operation` is serialized
    fn serialize_operation(operation: &Self::Operation) -> Result<Vec<u8>, String> {
        bcs::to_bytes(operation)
            .map_err(|e| format!("BCS serialization error {e:?} for operation {operation:?}"))
    }

    /// How the `Response` is deserialized
    fn deserialize_response(response: Vec<u8>) -> Result<Self::Response, String> {
        bcs::from_bytes(&response)
            .map_err(|e| format!("BCS deserialization error {e:?} for response {response:?}"))
    }

    /// How the `Response` is serialized
    fn serialize_response(response: Self::Response) -> Result<Vec<u8>, String> {
        bcs::to_bytes(&response)
            .map_err(|e| format!("BCS serialization error {e:?} for response {response:?}"))
    }
}
All these types must implement the Serialize, DeserializeOwned, Send, Sync, Debug traits, and have a 'static lifetime.

In our example, we would like to change our Operation to u64, like so:

pub struct CounterAbi;

impl ContractAbi for CounterAbi {
    type Operation = u64;
    type Response = u64;
}
Service ABI

The ServiceAbi is in principle very similar to the ContractAbi, just for the service component of your application.

The ServiceAbi trait defines the types used by the service part of your application:

/// A trait that includes all the types exported by a Linera application service.
pub trait ServiceAbi {
    /// The type of a query receivable by the application's service.
    type Query: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// The response type of the application's service.
    type QueryResponse: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;
}
For our Counter example, we'll be using GraphQL to query our application so our ServiceAbi should reflect that:

use async_graphql::{Request, Response};

impl ServiceAbi for CounterAbi {
    type Query = Request;
    type QueryResponse = Response;
}
References

The full trait definition of Abi can be found here.

The full Counter example application can be found here.

Writing the Contract Binary

The contract binary is the first component of a Linera application. It can actually change the state of the application.

To create a contract, we need to create a new type and implement the Contract trait for it, which is as follows:

pub trait Contract: WithContractAbi + ContractAbi + Sized {
    /// The type of message executed by the application.
    type Message: Serialize + DeserializeOwned + Debug;

    /// Immutable parameters specific to this application (e.g. the name of a token).
    type Parameters: Serialize + DeserializeOwned + Clone + Debug;

    /// Instantiation argument passed to a new application on the chain that created it
    /// (e.g. an initial amount of tokens minted).
    type InstantiationArgument: Serialize + DeserializeOwned + Debug;

    /// Event values for streams created by this application.
    type EventValue: Serialize + DeserializeOwned + Debug;

    /// Creates an in-memory instance of the contract handler.
    async fn load(runtime: ContractRuntime<Self>) -> Self;

    /// Instantiates the application on the chain that created it.
    async fn instantiate(&mut self, argument: Self::InstantiationArgument);

    /// Applies an operation from the current block.
    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response;

    /// Applies a message originating from a cross-chain message.
    async fn execute_message(&mut self, message: Self::Message);

    /// Reacts to new events on streams.
    ///
    /// This is called whenever there is a new event on any stream that this application
    /// subscribes to.
    async fn process_streams(&mut self, _updates: Vec<StreamUpdate>) {}

    /// Finishes the execution of the current transaction.
    async fn store(self);
}
There's quite a bit going on here, so let's break it down and take one method at a time.

For this application, we'll be using the load, execute_operation and store methods.

The contract lifecycle

To implement the application contract, we first create a type for the contract:

linera_sdk::contract!(CounterContract);

pub struct CounterContract {
    state: CounterState,
    runtime: ContractRuntime<Self>,
}
This type usually contains at least two fields: the persistent state defined earlier and a handle to the runtime. The runtime provides access to information about the current execution and also allows sending messages, among other things. Other fields can be added, and they can be used to store volatile data that only exists while the current transaction is being executed, and discarded afterwards.

When a transaction is executed, the contract type is created through a call to Contract::load method. This method receives a handle to the runtime that the contract can use, and should use it to load the application state. For our implementation, we will load the state and create the CounterContract instance:

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = CounterState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        CounterContract { state, runtime }
    }
When the transaction finishes executing successfully, there's a final step where all loaded application contracts are called in order to do any final checks and persist its state to storage. That final step is a call to the Contract::store method, which can be thought of as similar to executing a destructor. In our implementation we will persist the state back to storage:

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
It's possible to do more than just saving the state, and the Contract finalization section provides more details on that.

Instantiating our Application

The first thing that happens when an application is created from a bytecode is that it is instantiated. This is done by calling the contract's Contract::instantiate method.

Contract::instantiate is only called once when the application is created and only on the microchain that created the application.

Deployment on other microchains will use the Default value of all sub-views in the state if the state uses the view paradigm.

For our example application, we'll want to initialize the state of the application to an arbitrary number that can be specified on application creation using its instantiation parameters:

    async fn instantiate(&mut self, value: u64) {
        // Validate that the application parameters were configured correctly.
        self.runtime.application_parameters();

        self.state.value.set(value);
    }
Implementing the increment operation

Now that we have our counter's state and a way to initialize it to any value we would like, we need a way to increment our counter's value. Execution requests from block proposers or other applications are broadly called 'operations'.

To handle an operation, we need to implement the Contract::execute_operation method. In the counter's case, the operation it will be receiving is a u64 which is used to increment the counter by that value:

    async fn execute_operation(&mut self, operation: u64) -> u64 {
        let new_value = self.state.value.get() + operation;
        self.state.value.set(new_value);
        new_value
    }
Declaring the ABI

Finally, we link our Contract trait implementation with the ABI of the application:

impl WithContractAbi for CounterContract {
    type Abi = CounterAbi;
}

Writing the Service Binary

The service binary is the second component of a Linera application. It is compiled into a separate Bytecode from the contract and is run independently. It is not metered (meaning that querying an application's service does not consume gas), and can be thought of as a read-only view into your application.

Application states can be arbitrarily complex, and most of the time you don't want to expose this state in its entirety to those who would like to interact with your app. Instead, you might prefer to define a distinct set of queries that can be made against your application.

The Service trait is how you define the interface into your application. The Service trait is defined as follows:

pub trait Service: WithServiceAbi + ServiceAbi + Sized {
    /// Immutable parameters specific to this application.
    type Parameters: Serialize + DeserializeOwned + Send + Sync + Clone + Debug + 'static;

    /// Creates an in-memory instance of the service handler.
    async fn new(runtime: ServiceRuntime<Self>) -> Self;

    /// Executes a read-only query on the state of this application.
    async fn handle_query(&self, query: Self::Query) -> Self::QueryResponse;
}
Let's implement Service for our counter application.

First, we create a new type for the service, similarly to the contract:

linera_sdk::service!(CounterService);

pub struct CounterService {
    state: CounterState,
    runtime: Arc<ServiceRuntime<Self>>,
}
Just like with the CounterContract type, this type usually has two types: the application state and the runtime. We can omit the fields if we don't use them, so in this example we're omitting the runtime field, since its only used when constructing the CounterService type.

As before, the macro service! generates the necessary boilerplate for implementing the service WIT interface, exporting the necessary resource types and functions so that the service can be executed.

Next, we need to implement the Service trait for CounterService type. The first step is to define the Service's associated type, which is the global parameters specified when the application is instantiated. In our case, the global parameters aren't used, so we can just specify the unit type:

impl Service for CounterService {
    type Parameters = ();

    // ...
}
Also like in contracts, we must implement a load constructor when implementing the Service trait. The constructor receives the runtime handle and should use it to load the application state:


    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = CounterState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        CounterService {
            state,
            runtime: Arc::new(runtime),
        }
    }
Services don't have a store method because they are read-only and can't persist any changes back to the storage.

The actual functionality of the service starts in the handle_query method. We will accept GraphQL queries and handle them using the async-graphql crate. To forward the queries to custom GraphQL handlers we will implement in the next section, we use the following code:

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            QueryRoot {
                value: *self.state.value.get(),
            },
            MutationRoot {
                runtime: self.runtime.clone(),
            },
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
Finally, as before, the following code is needed to incorporate the ABI definitions into your Service implementation:

impl WithServiceAbi for CounterService {
    type Abi = counter::CounterAbi;
}
Adding GraphQL compatibility

Finally, we want our application to have GraphQL compatibility. To achieve this we need a QueryRoot to respond to queries and a MutationRoot for creating serialized Operation values that can be placed in blocks.

In the QueryRoot, we only create a single value query that returns the counter's value:

struct QueryRoot {
    value: u64,
}

#[Object]
impl QueryRoot {
    async fn value(&self) -> &u64 {
        &self.value
    }
}
In the MutationRoot, we only create one increment method that returns a serialized operation to increment the counter by the provided value:

struct MutationRoot {
    runtime: Arc<ServiceRuntime<CounterService>>,
}

#[Object]
impl MutationRoot {
    async fn increment(&self, value: u64) -> [u8; 0] {
        self.runtime.schedule_operation(&value);
        []
    }
}
We haven't included the imports in the above code. If you want the full source code and associated tests check out the examples section on GitHub.

Deploying the Application

The first step to deploy your application is to configure a wallet. This will determine where the application will be deployed: either to a local net or to the public deployment (i.e. a devnet or a testnet).

Local network

To configure the local network, follow the steps in the Getting Started section.

Afterwards, the LINERA_WALLET, LINERA_STORAGE, LINERA_KEYSTORE environment variables should be set and can be used in the publish-and-create command to deploy the application while also specifying:

The location of the contract bytecode
The location of the service bytecode
The JSON encoded initialization arguments
linera publish-and-create \
  target/wasm32-unknown-unknown/release/my_counter_{contract,service}.wasm \
  --json-argument "42"
Devnets and Testnets

To configure the wallet for the current testnet while creating a new microchain, the following command can be used:

linera wallet init --faucet https://faucet.testnet-conway.linera.net
linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net
The Faucet will provide the new chain with some tokens, which can then be used to deploy the application with the publish-and-create command. It requires specifying:

The location of the contract bytecode
The location of the service bytecode
The JSON encoded initialization arguments
linera publish-and-create \
  target/wasm32-unknown-unknown/release/my_counter_{contract,service}.wasm \
  --json-argument "42"
Interacting with the application

To interact with the deployed application, a node service must be used.