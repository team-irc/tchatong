import {
  GetServerSideProps,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Image from "next/image";
import { CSSProperties, FC, useEffect, useState } from "react";
import Header from "../layout/header";
import styles from "../styles/Statistics.module.css";
import { Box, Card, MenuItem, Select, Badge } from "@mui/material";
import MostUsedTable from "../components/MostUsedTable";
import dynamic from "next/dynamic";
import useChart from "../components/hooks/useChart";
import useBrushChart from "../components/hooks/useBrushChart";
import useBadge from "../components/hooks/useBadge";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function numberWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
      onAir: boolean;
      viewers: number;
      followers: number;
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
  const [chartType, setChartType] = useState<ChartType>("line");
  const [candleType, setCandleType] = useState<CandleType>("fiveMinuteCandle");
  const badgeProps = useBadge(data.streamerInfo.onAir);

  const chatfireToSeries = (chatfire: ChartData[]) => {
    return [
      {
        name: "평균 채팅 화력",
        data: chatfire.map((el) => {
          const localTime = new Date(el.time).getTime() + 9 * 60 * 60 * 1000;
          return [new Date(localTime).toISOString(), el.count];
        }),
      },
    ];
  };

  const series = chatfireToSeries(data[candleType]);
  const [lineChartOption, setChartSeries, setType] = useChart(series);
  const [brushChartOption, setBrushChartSeries] = useBrushChart(series);

  useEffect(() => {
    const series = chatfireToSeries(data[candleType]);
    setChartSeries(series);
    setBrushChartSeries(series);
  }, [candleType, data, setChartSeries, setBrushChartSeries]);

  useEffect(() => {
    setType(chartType);
  }, [chartType, setType]);

  return (
    <Header>
      <div className={styles.Frame}>
        <Box className={styles.StreamerInfo}>
          <Badge {...(badgeProps as any)}>
            <Image
              src={data.streamerInfo.image_url}
              width={133}
              height={133}
              className={styles.StreamerImg}
              alt="streamer avatar image"
            />
          </Badge>
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
            <span className={styles.StreamerFollowers}>
              팔로워: {numberWithCommas(data.streamerInfo.followers)}명
            </span>
            <br />
            <span className={styles.StreamerCurrentViewers}>
              현재 시청자 수: {numberWithCommas(data.streamerInfo.viewers)}명
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
              onChange={(e) => setChartType(e.target.value as "line" | "bar")}
            >
              <MenuItem value={"line"}>꺾은선 그래프</MenuItem>
              <MenuItem value={"bar"}>막대 그래프</MenuItem>
            </Select>
          </Box>
          <Chart {...lineChartOption} />
          <Chart {...brushChartOption} />
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
          Streamer_getOneByNick(nick: "${params?.streamer_nick}") {
            image_url,
            streamer_login,
            nick,
            onAir,
            viewers,
            followers
           }
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
