import {
  GetServerSideProps,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { CSSProperties, FC, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import Header from "../layout/header";
import styles from "../styles/Statistics.module.css";
import { Box } from "@material-ui/core";
import { Card } from "@mui/material";
import { useRouter } from "next/router";

interface StatisticsProps {
  data: {
    Streamer_getOneByNick: {
      image_url: string;
      streamer_id: string;
      nick: string;
    };
    Chatfire_getDayAverageByNick: [
      {
        count: number;
        time: string;
      }
    ];
    Chatfire_getDayTopByNick: {
      count: number;
    };
    Chatfire_getCurrentByNick: {
      count: number;
    };
    Chatfire_getEntireTopByNick: {
      count: number;
    };
  };
}

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

const Statistics: NextPage<StatisticsProps> = ({
  data: {
    Streamer_getOneByNick,
    Chatfire_getCurrentByNick,
    Chatfire_getDayTopByNick,
    Chatfire_getEntireTopByNick,
    Chatfire_getDayAverageByNick,
  },
}: InferGetServerSidePropsType<
  GetServerSideProps<StatisticsProps>
>): JSX.Element => {
  const router = useRouter();
  const chart = useRef<Chart<"line", number[], string>>();

  /*
   ** draw chart
   */
  useEffect(() => {
    let ctx = (
      document.getElementById("chart") as HTMLCanvasElement
    ).getContext("2d");
    Chart.register(...registerables);
    if (ctx !== null) {
      chart.current = new Chart(ctx, {
        type: "line",
        options: {
          elements: {
            point: {
              radius: 0,
            },
          },
        },
        data: {
          labels: Chatfire_getDayAverageByNick.map((el) => el.time),
          datasets: [
            {
              label: "시간당 평균 채팅 수",
              data: Chatfire_getDayAverageByNick.map((el) => el.count),
              fill: false,
              borderColor: "rgb(137, 88, 216)",
              tension: 0.1,
            },
          ],
        },
      });
    }
    return () => chart.current?.destroy();
  }, [router.query.streamer_nick]);

  return (
    <Header>
      <div className={styles.Frame}>
        <Box className={styles.StreamerInfo}>
          <img
            src={Streamer_getOneByNick.image_url}
            className={styles.StreamerImg}
            alt="streamer avatar image"
          />
          <span className={styles.StreamerInfoText}>
            <a
              href={`https://www.twitch.tv/${Streamer_getOneByNick.streamer_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.StreamerNick}
            >
              {Streamer_getOneByNick.nick}
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
              head="현재 채팅 화력"
              body={`분당 ${Chatfire_getCurrentByNick.count}회`}
              className={styles.CardItem}
            />
            <StatisticsCard
              head="금일 최고 채팅 화력"
              body={`분당 ${Chatfire_getDayTopByNick.count}회`}
              className={styles.CardItem}
            />
            <StatisticsCard
              head="역대 최고 채팅 화력"
              body={`분당 ${Chatfire_getEntireTopByNick.count}회`}
              className={styles.CardItem}
            />
          </Box>
        </Box>
      </div>
    </Header>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
}): Promise<GetServerSidePropsResult<StatisticsProps>> => {
  const getData = async (): Promise<StatisticsProps> => {
    const res: Response = await fetch("http://backend:3000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `{
          Streamer_getOneByNick(nick: "${params?.streamer_nick}") { image_url, streamer_id, nick }
          Chatfire_getDayAverageByNick(nick: "${params?.streamer_nick}") { count, time }
          Chatfire_getDayTopByNick(nick: "${params?.streamer_nick}") { count }
          Chatfire_getCurrentByNick(nick: "${params?.streamer_nick}") { count }
          Chatfire_getEntireTopByNick(nick: "${params?.streamer_nick}") { count }
        }`,
      }),
    });
    return await res.json();
  };
  const data = (await getData()).data;
  return { props: { data } };
};

export default Statistics;
