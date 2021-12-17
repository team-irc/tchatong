import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { CSSProperties, FC, useEffect, useMemo, useRef } from "react";
import { Chart, registerables } from "chart.js";
import Header from "../layout/header";
import styles from "../styles/Statistics.module.css";
import { Box } from "@material-ui/core";
import { Card } from "@mui/material";
import { Streamer } from "../interfaces/streamer";

const data1 = [
  12, 29, 19, 18, 13, 12, 27, 7, 15, 1, 15, 8, 13, 4, 21, 24, 10, 25, 27, 12, 6,
  16, 25, 10,
];

const data2 = [
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 10, 10, 10, 10,
];

let arr: Array<string> = [];

for (let i = 1; i < 25; ++i) {
  arr.push(String(i));
}

Object.freeze(arr);

const StatisticsCard: FC<{
  head: string;
  body: string;
  className?: string;
  style?: CSSProperties;
}> = ({ head, body, className, style }): JSX.Element => {
  return (
    <Card
      className={className}
      style={Object.assign(
        { display: "flex", flexDirection: "column", alignItems: "center" },
        style
      )}
    >
      <span
        style={{
          width: "100%",
          padding: "1.2rem",
          background: "var(--purple1)",
          color: "var(--background-white)",
        }}
      >
        {head}
      </span>
      <span style={{ padding: "1rem", fontSize: "2rem" }}>{body}</span>
    </Card>
  );
};

const Statistics: NextPage = ({
  data,
}: InferGetServerSidePropsType<GetServerSideProps>): JSX.Element => {
  const router = useRouter();
  const chart = useRef<Chart<"line", number[], string>>();
  const { streamer_nick } = router.query;
  const image_url = useMemo(
    () =>
      (data as Streamer[]).filter(
        (element) => element.nick === streamer_nick
      )[0].image_url,
    [streamer_nick]
  );

  useEffect(() => {
    let ctx = (
      document.getElementById("chart") as HTMLCanvasElement
    ).getContext("2d");
    Chart.register(...registerables);
    if (ctx !== null) {
      chart.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: arr,
          datasets: [
            {
              label: "시간당 평균 채팅 수",
              data: data1,
              fill: false,
              borderColor: "rgb(137, 88, 216)",
              tension: 0.1,
            },
            {
              label: "다른 스트리머의 시간당 평균 채팅 수",
              data: data2,
              fill: false,
              borderColor: "rgb(255, 198, 255)",
              tension: 0.1,
            },
          ],
        },
      });
    }
    return () => chart.current?.destroy();
  }, []);

  return (
    <Header>
      <div className={styles.Frame}>
        <Box className={styles.StreamerInfo}>
          <img
            src={image_url}
            className={styles.StreamerImg}
            alt="streamer avatar image"
          />
          <span className={styles.StreamerInfoText}>
            <a
              href={`https://www.twitch.tv/Funzinnu`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.StreamerNick}
            >
              {streamer_nick}
            </a>
            <br />
            <span className={styles.StreamerFollowers}>팔로워: 30만명</span>
            <br />
            <span className={styles.StreamerLastStreaming}>
              마지막 방송: 30분 전
            </span>
          </span>
          <StatisticsCard
            className={styles.RecentlyUsedWord}
            head="최근 가장 많이 쓰인 단어"
            body="나락"
          />
        </Box>
        <Box style={{ width: "100%" }}>
          <Box style={{ width: "100%", height: "auto", maxHeight: "40rem" }}>
            <canvas id="chart" className={styles.Canvas} />
          </Box>
          <Box className={styles.CardList}>
            <StatisticsCard
              head="분당 평균 채팅 화력"
              body="분당 15회"
              className={styles.CardItem}
            />
            <StatisticsCard
              head="분당 최고 채팅 화력"
              body="분당 30회"
              className={styles.CardItem}
            />
            <StatisticsCard
              head="분당 최저 채팅 화력"
              body="분당 0회"
              className={styles.CardItem}
            />
          </Box>
        </Box>
      </div>
    </Header>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res: Response = await fetch("http://backend:3000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: "{ Streamer_getAll { nick, image_url } }" }),
  });
  const data: Streamer[] = (await res.json()).data.Streamer_getAll;
  if (!data) return { notFound: true };
  return { props: { data } };
};

export default Statistics;
