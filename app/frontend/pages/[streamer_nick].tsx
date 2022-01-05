import {
  GetServerSideProps,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Image from "next/image";
import { CSSProperties, FC, useEffect, useRef, useState } from "react";
import Header from "../layout/header";
import styles from "../styles/Statistics.module.css";
import { Box, Card, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/router";
import MostUsedTable from "../components/MostUsedTable";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

let option = {
  options: {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  },
  series: [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ],
};

type CandleType =
  | "oneMinuteCandle"
  | "fiveMinuteCandle"
  | "tenMinuteCandle"
  | "oneHourCandle";
type ChartType = "line" | "bar";
interface ChartData {
  count: number;
  time: string;
}

interface StatisticsProps {
  data: {
    streamerInfo: {
      image_url: string;
      streamer_login: string;
      nick: string;
    };
    dayTopChatFire: { count: number };
    currentChatFire: { count: number };
    entireTopChatFire: { count: number };
    mostUsedWord: string[];
    oneMinuteCandle: ChartData[];
    fiveMinuteCandle: ChartData[];
    tenMinuteCandle: ChartData[];
    oneHourCandle: ChartData[];
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
  data,
}: InferGetServerSidePropsType<
  GetServerSideProps<StatisticsProps>
>): JSX.Element => {
  const router = useRouter();
  const [candleType, setCandleType] = useState<CandleType>("oneHourCandle");
  const [chartType, setChartType] = useState<ChartType>("line");

  return (
    <Header>
      <div className={styles.Frame}>
        <Box className={styles.StreamerInfo}>
          <Image
            src={data.streamerInfo.image_url}
            width={133}
            height={133}
            className={styles.StreamerImg}
            alt="streamer avatar image"
          />
          <span className={styles.StreamerInfoText}>
            <a
              href={`https://www.twitch.tv/${data.streamerInfo.streamer_login}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.StreamerNick}
            >
              {data.streamerInfo.nick}
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
            body={
              data.mostUsedWord[0].length === 0 ? "없음" : data.mostUsedWord[0]
            }
          />
        </Box>
        <Box style={{ width: "100%" }}>
          <Box style={{ width: "100%", padding: "2rem" }}>
            <MostUsedTable rows={data.mostUsedWord} />
          </Box>
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Select
              value={candleType}
              onChange={(e) => setCandleType(e.target.value as CandleType)}
            >
              <MenuItem value={"oneMinuteCandle"}>1분</MenuItem>
              <MenuItem value={"fiveMinuteCandle"}>5분</MenuItem>
              <MenuItem value={"tenMinuteCandle"}>10분</MenuItem>
              <MenuItem value={"oneHourCandle"}>1시간</MenuItem>
            </Select>
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
            >
              <MenuItem value={"line"}>꺾은선 그래프</MenuItem>
              <MenuItem value={"bar"}>막대 그래프</MenuItem>
            </Select>
          </Box>
          <Chart
            options={option.options}
            series={option.series}
            type="bar"
            width="500"
          />
          <Box className={styles.CardList}>
            <StatisticsCard
              head="현재 채팅 화력"
              body={`분당 ${data.currentChatFire.count}회`}
              className={styles.CardItem}
            />
            <StatisticsCard
              head="금일 최고 채팅 화력"
              body={`분당 ${data.dayTopChatFire.count}회`}
              className={styles.CardItem}
            />
            <StatisticsCard
              head="역대 최고 채팅 화력"
              body={`분당 ${data.entireTopChatFire.count}회`}
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
  const getData = async (): Promise<any> => {
    const res: Response = await fetch("http://backend:3000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `{
          Streamer_getOneByNick(nick: "${params?.streamer_nick}") { image_url, streamer_login, nick }
          Chatfire_getDayTopByNick(nick: "${params?.streamer_nick}") { count }
          Chatfire_getCurrentByNick(nick: "${params?.streamer_nick}") { count }
          Chatfire_getEntireTopByNick(nick: "${params?.streamer_nick}") { count }
          Topword_getTopwordByNick(nick: "${params?.streamer_nick}") {
            top1,
            top2,
            top3,
            top4,
            top5,
            top6,
            top7,
            top8,
            top9,
            top10
          }
          Chatfire_getAverageOfaMinuteIntervalsForOneDayByNick(nick: "${params?.streamer_nick}") { count, time }
          Chatfire_getAverageOfFiveMinuteIntervalsForOneDayByNick(nick: "${params?.streamer_nick}") { count, time }
          Chatfire_getAverageOfTenMinuteIntervalsForOneDayByNick(nick: "${params?.streamer_nick}") { count, time }
          Chatfire_getAverageOfOneHourIntervalsForOneDayByNick(nick: "${params?.streamer_nick}") { count, time }
        }`,
      }),
    });
    return await res.json();
  };
  const data = (await getData()).data;
  return {
    props: {
      data: {
        streamerInfo: data.Streamer_getOneByNick,
        dayTopChatFire: data.Chatfire_getDayTopByNick,
        currentChatFire: data.Chatfire_getCurrentByNick,
        entireTopChatFire: data.Chatfire_getEntireTopByNick,
        mostUsedWord: [
          data.Topword_getTopwordByNick.top1,
          data.Topword_getTopwordByNick.top2,
          data.Topword_getTopwordByNick.top3,
          data.Topword_getTopwordByNick.top4,
          data.Topword_getTopwordByNick.top5,
          data.Topword_getTopwordByNick.top6,
          data.Topword_getTopwordByNick.top7,
          data.Topword_getTopwordByNick.top8,
          data.Topword_getTopwordByNick.top9,
          data.Topword_getTopwordByNick.top10,
        ],
        oneMinuteCandle:
          data.Chatfire_getAverageOfaMinuteIntervalsForOneDayByNick,
        fiveMinuteCandle:
          data.Chatfire_getAverageOfFiveMinuteIntervalsForOneDayByNick,
        tenMinuteCandle:
          data.Chatfire_getAverageOfTenMinuteIntervalsForOneDayByNick,
        oneHourCandle:
          data.Chatfire_getAverageOfOneHourIntervalsForOneDayByNick,
      },
    },
  };
};

export default Statistics;
