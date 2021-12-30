import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Footer from "../layout/footer";
import Metadata from "../components/metadata";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <Metadata />
      </Head>
      <Footer>
        <Component {...pageProps} />
      </Footer>
    </>
  );
}

export default MyApp;
