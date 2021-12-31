import {
  GetServerSideProps,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Image from "next/image";
import { CSSProperties, FC, useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import Header from "../layout/header";
import styles from "../styles/Statistics.module.css";
import { Box, Card, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/router";

type CandleType = 1 | 5 | 10 | 60;
type ChartType = "line" | "bar";

interface StatisticsProps {
  data: {
    Streamer_getOneByNick: {
      image_url: string;
      streamer_id: string;
      nick: string;
    };
    Chatfire_getAverageOfOneHourIntervalsForOneDayByNick: [
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
    Topword_getTopwordByNick: {
      top1: string;
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
    Streamer_getOneByNick: streamerInfo,
    Chatfire_getCurrentByNick: currentChatFire,
    Chatfire_getDayTopByNick: dayTopChatFire,
    Chatfire_getEntireTopByNick: entireTopChatFire,
    Chatfire_getAverageOfOneHourIntervalsForOneDayByNick: oneHourCandle,
    Topword_getTopwordByNick: mostUsedWord,
  },
}: InferGetServerSidePropsType<
  GetServerSideProps<StatisticsProps>
>): JSX.Element => {
  const router = useRouter();
  const chart = useRef<Chart<"line", number[], string>>();
  const [candleType, setCandleType] = useState<CandleType>(60);
  const [chartType, setChartType] = useState<ChartType>("line");

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
          labels: oneHourCandle.map((el) => el.time),
          datasets: [
            {
              label: "시간당 평균 채팅 수",
              data: oneHourCandle.map((el) => el.count),
              fill: false,
              borderColor: "rgb(137, 88, 216)",
              tension: 0.1,
            },
          ],
        },
      });
    }
    return () => chart.current?.destroy();
  }, [router.query.streamer_nick, oneHourCandle]);

  return (
    <Header>
      <div className={styles.Frame}>
        <Box className={styles.StreamerInfo}>
          <Image
            src={streamerInfo.image_url}
            width={133}
            height={133}
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
            body={mostUsedWord.top1.length === 0 ? "없음" : mostUsedWord.top1}
          />
        </Box>
        <Box style={{ width: "100%" }}>
          <Select
            value={candleType}
            onChange={(e) => setCandleType(e.target.value as CandleType)}
          >
            <MenuItem value={1}>1분</MenuItem>
            <MenuItem value={5}>5분</MenuItem>
            <MenuItem value={10}>10분</MenuItem>
            <MenuItem value={60}>1시간</MenuItem>
          </Select>
          <Select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
          >
            <MenuItem value={"line"}>꺾은선 그래프</MenuItem>
            <MenuItem value={"bar"}>막대 그래프</MenuItem>
          </Select>
          <Box style={{ width: "100%", height: "auto", maxHeight: "40rem" }}>
            <canvas id="chart" className={styles.Canvas} />
          </Box>
          <Box className={styles.CardList}>
            <StatisticsCard
              head="현재 채팅 화력"
              body={`분당 ${currentChatFire.count}회`}
              className={styles.CardItem}
            />
            <StatisticsCard
              head="금일 최고 채팅 화력"
              body={`분당 ${dayTopChatFire.count}회`}
              className={styles.CardItem}
            />
            <StatisticsCard
              head="역대 최고 채팅 화력"
              body={`분당 ${entireTopChatFire.count}회`}
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
          Chatfire_getAverageOfOneHourIntervalsForOneDayByNick(nick: "${params?.streamer_nick}") { count, time }
          Chatfire_getDayTopByNick(nick: "${params?.streamer_nick}") { count }
          Chatfire_getCurrentByNick(nick: "${params?.streamer_nick}") { count }
          Chatfire_getEntireTopByNick(nick: "${params?.streamer_nick}") { count }
          Topword_getTopwordByNick(nick: "${params?.streamer_nick}") { top1 }
        }`,
      }),
    });
    return await res.json();
  };
  const data = (await getData()).data;
  return { props: { data } };
};

export default Statistics;
