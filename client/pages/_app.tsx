import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MetaMaskProvider } from "metamask-react";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetaMaskProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MetaMaskProvider>
  );
}

export default MyApp;
