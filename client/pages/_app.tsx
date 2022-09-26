import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MetaMaskProvider } from "metamask-react";
import Layout from "../components/Layout";
import Web3Errors from "../components/Web3Errors";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <MetaMaskProvider>
    <Layout>
      <Web3Errors>
        <Component {...pageProps} />
      </Web3Errors>
    </Layout>
  </MetaMaskProvider>
);

export default MyApp;
