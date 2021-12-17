import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Footer from "../layout/footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>트채통 | 트위치 채팅 통계 시스템</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Footer>
        <Component {...pageProps} />
      </Footer>
    </>
  );
}

export default MyApp;
