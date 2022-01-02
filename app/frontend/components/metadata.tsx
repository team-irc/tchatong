import { FC } from "react";

const Metadata: FC = (): JSX.Element => {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="트위치 스트리머 별 채팅 통계를 알아보세요."
      />
      <meta property="og:url" content="https://www.tchatong.info" />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content="https://www.tchatong.info/tchatong_og.png"
      />
      <meta property="og:title" content="트채통 | 트위치 채팅 통계 시스템" />
      <meta
        property="og:description"
        content="트위치 스트리머 별 채팅 통계를 알아보세요."
      />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="트채통 | 트위치 채팅 통계 시스템" />
      <meta name="twitter:url" content="https://www.tchatong.info/" />
      <meta
        name="twitter:image"
        content="https://www.tchatong.info/tchatong_og.png"
      />
      <meta
        name="twitter:description"
        content="트위치 스트리머 별 채팅 통계를 알아보세요."
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#8958d8" />
    </>
  );
};

export default Metadata;
