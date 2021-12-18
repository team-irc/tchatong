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
import { Streamer } from "../interfaces/streamer";
import { Chatfire } from "../interfaces/chat-fire";
import { useRouter } from "next/router";

interface StatisticsProps {
  data: {
    streamerInfo: Streamer;
    chatfire: Chatfire[];
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
  data: { streamerInfo, chatfire },
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
        data: {
          labels: chatfire.map((el) => new Date(el.date).toLocaleTimeString()),
          datasets: [
            {
              label: "시간당 평균 채팅 수",
              data: chatfire.map((el) => el.count),
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
            src={streamerInfo.image_url}
            className={styles.StreamerImg}
            alt="streamer avatar image"
          />
          <span className={styles.StreamerInfoText}>
            <a
              href={`https://www.twitch.tv/${streamerInfo.streamer_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.StreamerNick}
            >
              {streamerInfo.nick}
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

export const getServerSideProps: GetServerSideProps = async ({
  params,
}): Promise<GetServerSidePropsResult<StatisticsProps>> => {
  const getStreamerInfo = async (): Promise<Streamer> => {
    const res: Response = await fetch("http://backend:3000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `{ Streamer_getOneByNick(nick: "${params?.streamer_nick}") { image_url, streamer_id, nick } }`,
      }),
    });
    return (await res.json()).data.Streamer_getOneByNick;
  };
  const getChatFire = async (): Promise<Chatfire[]> => {
    const res: Response = await fetch("http://backend:3000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `{ Chatfire_getOneByNick(nick: "${params?.streamer_nick}") { count, date } }`,
      }),
    });
    return (await res.json()).data.Chatfire_getOneByNick;
  };

  const streamerInfo: Streamer = await getStreamerInfo();
  const chatfire: Chatfire[] = await getChatFire();
  return { props: { data: { streamerInfo, chatfire } } };
};

export default Statistics;
