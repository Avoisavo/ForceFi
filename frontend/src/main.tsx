import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { LineraProvider } from './contexts/LineraContext'

// Get your Dynamic environment ID from https://app.dynamic.xyz/
const DYNAMIC_ENVIRONMENT_ID = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || 'REPLACE_WITH_YOUR_ENVIRONMENT_ID';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <LineraProvider>
        <App />
      </LineraProvider>
    </DynamicContextProvider>
  </StrictMode>,
)
