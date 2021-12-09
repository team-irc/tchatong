import { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "../layout/header";
import { Line } from "react-chartjs-2";
import styles from "../styles/Statistics.module.css";

const res = [
  12, 29, 19, 18, 13, 12, 27, 7, 15, 1, 15, 8, 13, 4, 21, 24, 10, 25, 27, 12, 6,
  16, 25, 10,
];

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "First dataset",
      data: [33, 53, 85, 41, 44, 65],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
    },
  ],
};

const Statistics: NextPage = (): JSX.Element => {
  const router = useRouter();
  const { streamer_nick } = router.query;

  return (
    <Header>
      <div className={styles.Frame}>
        <Line data={data} />
      </div>
    </Header>
  );
};

export default Statistics;
