import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import Header from "../layout/header";
import styles from "../styles/Statistics.module.css";
import Image from "next/image";
import { Box } from "@material-ui/core";
import { Card } from "@mui/material";

const data = [
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

const Statistics: NextPage = (): JSX.Element => {
  const router = useRouter();
  const chart = useRef<Chart<"line", number[], string>>();
  const { streamer_nick } = router.query;

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
              data: data,
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
          <div className={styles.StreamerImg}>
            <Image
              src="data:image/png;base64,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"
              width="150rem"
              height="150rem"
              alt="streamer avatar image"
            />
          </div>
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
          <Card className={styles.RecentlyUsedWord}>
            <span
              style={{
                padding: "1rem",
                background: "var(--purple1)",
                color: "var(--background-white)",
              }}
            >
              최근 가장 많이 쓰인 단어
            </span>
            <span style={{ padding: "1rem", fontSize: "2rem" }}>나락</span>
          </Card>
        </Box>
        <canvas id="chart" width="100%" height="30rem" />
      </div>
    </Header>
  );
};

export default Statistics;
