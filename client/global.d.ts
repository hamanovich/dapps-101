declare global {
  interface Window {
    ethereum: import("ethers").providers.ExternalProvider;
  }
}

interface Window {
  ethereum: import("ethers").providers.ExternalProvider;
}
