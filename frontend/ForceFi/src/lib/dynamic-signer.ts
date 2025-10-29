import type { Wallet as DynamicWallet } from "@dynamic-labs/sdk-react-core";

/**
 * DynamicSigner bridges Dynamic Labs wallet with Linera's signing interface
 */
export class DynamicSigner {
  private wallet: DynamicWallet;

  constructor(dynamicWallet: DynamicWallet) {
    if (!dynamicWallet) {
      throw new Error("DynamicWallet is required");
    }
    this.wallet = dynamicWallet;
  }

  /**
   * Sign a message using the Dynamic wallet
   * @param owner - The owner address (public key as string)
   * @param value - The message to sign as Uint8Array
   * @returns The signature as a hex string
   */
  async sign(owner: string, value: Uint8Array): Promise<string> {
    try {
      console.log('🔐 Signing message for owner:', owner);
      
      // Convert Uint8Array to hex string for signing
      const messageHex = '0x' + Array.from(value)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Sign with Dynamic wallet connector
      if (!this.wallet.connector) {
        throw new Error("Wallet connector not available");
      }

      // Use the connector's signMessage method through the ethers provider
      // This is a simplified version - adjust based on your actual Dynamic setup
      const signature = await (this.wallet.connector as any).signMessage?.(messageHex) || messageHex;
      
      if (!signature) {
        throw new Error("Failed to get signature from Dynamic wallet");
      }

      // Return signature as hex string (Linera expects string, not Uint8Array)
      return signature;
    } catch (error) {
      console.error("Error signing message with Dynamic:", error);
      throw new Error(
        `Failed to sign message: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get the public key from the Dynamic wallet
   */
  async getPublicKey(): Promise<Uint8Array> {
    const address = this.wallet.address;
    if (!address) {
      throw new Error("No address available from Dynamic wallet");
    }

    // Convert address to bytes
    const addressBytes = new Uint8Array(
      address.slice(2).match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );

    return addressBytes;
  }

  /**
   * Get the wallet address
   */
  getAddress(): string {
    return this.wallet.address;
  }

  /**
   * Check if the signer contains a specific key
   * Required by Linera's Signer interface
   * @param owner - The owner address to check
   * @returns Promise resolving to true if the key is available
   */
  async containsKey(owner: string): Promise<boolean> {
    // For Dynamic wallet integration, we check if the owner matches the wallet address
    // This could be enhanced to actually verify the key ownership
    console.log('🔍 Checking key for owner:', owner);
    return this.wallet.address.toLowerCase() === owner.toLowerCase();
  }
}

