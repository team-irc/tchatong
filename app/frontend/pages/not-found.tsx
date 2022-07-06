import Header from "../layout/header";
import Head from "next/head";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { useState } from "react";

const Statistics = () => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  return (
    <>
      <Head>
        <title>트채통 | 404</title>
      </Head>
      <Header>
        <div style={{margin: "5rem auto auto auto", width: "80%", height: "100vh", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center"}}>
          <SentimentDissatisfiedIcon style={{ fontSize: "10rem", lineHeight: "2.25rem", strokeWidth: 0 }} />
          <div style={{ fontSize: "1.8rem" }}>요청하신 스트리머를 찾을 수 없어요</div>
          <button onClick={() => {
            if (!isOpened) {
              setIsOpened(true);
              (window as any).Tawk_API.maximize();
            } else {
              setIsOpened(false);
              (window as any).Tawk_API.minimize();
            }
          }} style={{
            fontSize: "1rem",
            color: "white",
            marginTop: "1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "3px",
            borderRadius: "7px",
            backgroundColor: "var(--purple1)",
            padding: "0.5rem 1rem",
            justifyContent: "flex-end", }}>스트리머 추가 요청하기</button>
        </div>
      </Header>
    </>
  );
}

export default Statistics;