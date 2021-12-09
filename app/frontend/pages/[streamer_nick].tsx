import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Chart, registerables } from "chart.js";
import Header from "../layout/header";
import styles from "../styles/Statistics.module.css";

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
  const { streamer_nick } = router.query;

  useEffect(() => {
    var ctx = (
      document.getElementById("chart") as HTMLCanvasElement
    ).getContext("2d");
    Chart.register(...registerables);
    if (ctx !== null) {
      new Chart(ctx, {
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
  }, []);

  return (
    <Header>
      <div className={styles.Frame}>
        <canvas id="chart" width="100%" height="30rem" />
      </div>
    </Header>
  );
};

export default Statistics;
