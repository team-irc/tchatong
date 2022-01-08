import {
  GetServerSideProps,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Image from "next/image";
import { CSSProperties, FC, useState } from "react";
import Header from "../layout/header";
import styles from "../styles/Statistics.module.css";
import { Box, Card, MenuItem, Select, Badge } from "@mui/material";
import MostUsedTable from "../components/MostUsedTable";
import useBadge from "../components/hooks/useBadge";
import StatisticsChart from "../components/StatisticsChart";

function numberWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const onAirWrapper = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "auto",
};

const offAirNeonWrapper = {
  boxShadow: `
    0 0 0.1vw  0.4vw #d3d3d3,
    0 0 0.4vw  0.6vw #BDBDBD,
    0 0 0.5vw  0.4vw #7D7D7D,
    inset 0 0 0.5vw  0.4vw #7D7D7D,
    inset 0 0 0.4vw  0.2vw #BDBDBD,
    inset 0 0 0.5vw  0.2vw #d3d3d3`,
  borderRadius: "1.5rem",
};

const offAirNeonText = {
  fontSize: "4rem",
  color: "#e8e8e8",
  padding: "0rem 3.5rem 0 3.5rem",
  textShadow: `
    .1vw 0vw .25vw #d3d3d3, .2vw 0vw .25vw #d3d3d3, .4vw 0vw .25vw #d3d3d3,
    .1vw 0vw  .5vw #7D7D7D, .2vw 0vw .6vw #7D7D7D, .4vw 0vw .6vw #7D7D7D`,
};

const onAirNeonWrapper = {
  boxShadow: `
    0 0 0.1vw  0.4vw #c48dff,
    0 0 0.4vw  0.6vw #a672f6,
    0 0   4vw  0.4vw #8958d8,
    inset 0 0 1.5vw  0.4vw #8958d8,
    inset 0 0 0.4vw  0.2vw #a672f6,
    inset 0 0 0.5vw  0.2vw #c48dff`,
  borderRadius: "1.5rem",
};

const onAirNeonText = {
  fontSize: "4rem",
  color: "#e8e8e8",
  padding: "0rem 3.5rem 0 3.5rem",
  textShadow: `
    .1vw 0vw .25vw #c48dff, .2vw 0vw .25vw #c48dff, .4vw 0vw .25vw #c48dff,
    .1vw 0vw   0vw #a672f6, .2vw 0vw   0vw #a672f6, .4vw 0vw   0vw #a672f6,
    .1vw 0vw  .1vw #a672f6, .2vw 0vw  .1vw #a672f6, .4vw 0vw  .1vw #a672f6,
    .1vw 0vw   2vw #a672f6, .2vw 0vw   2vw #a672f6, .4vw 0vw   2vw #a672f6,
    .1vw 0vw   1vw #8958d8, .2vw 0vw   1vw #8958d8, .4vw 0vw   5vw #8958d8`,
};

type CandleType =
  | "oneMinuteCandle"
  | "fiveMinuteCandle"
  | "tenMinuteCandle"
  | "oneHourCandle";

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
        {
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
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
  const [candleType, setCandleType] = useState<CandleType>("fiveMinuteCandle");
  const badgeProps = useBadge(data.streamerInfo.onAir);

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
          <div style={onAirWrapper}>
            <div
              style={
                data.streamerInfo.onAir ? onAirNeonWrapper : offAirNeonWrapper
              }
            >
              <div
                style={data.streamerInfo.onAir ? onAirNeonText : offAirNeonText}
              >
                ON AIR
              </div>
            </div>
          </div>
        </Box>
        <Box style={{ width: "100%" }}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <span style={{ color: "rgba(0,0,0,0.5)" }}>
              &#8251;차트를 클릭하면 다시보기로 연결됩니다.
            </span>
            <Select
              value={candleType}
              onChange={(e) => setCandleType(e.target.value as CandleType)}
              style={{ marginLeft: "auto" }}
            >
              <MenuItem value={"oneMinuteCandle"}>1분</MenuItem>
              <MenuItem value={"fiveMinuteCandle"}>5분</MenuItem>
              <MenuItem value={"tenMinuteCandle"}>10분</MenuItem>
              <MenuItem value={"oneHourCandle"}>1시간</MenuItem>
            </Select>
          </Box>
          <StatisticsChart
            data={data[candleType]}
            streamer_login={data.streamerInfo.streamer_login}
          />
          <Box className={styles.TableBox}>
            <MostUsedTable rows={data.mostUsedWord} />
            <Box className={styles.CardList}>
              <StatisticsCard
                head="현재 채팅 화력🔥"
                body={`분당 ${data.currentChatFire.count}회`}
                className={styles.CardItem}
              />
              <StatisticsCard
                head="금일 최고 채팅 화력🔥"
                body={`분당 ${data.dayTopChatFire.count}회`}
                className={styles.CardItem}
              />
              <StatisticsCard
                head="역대 최고 채팅 화력🔥"
                body={`분당 ${data.entireTopChatFire.count}회`}
                className={styles.CardItem}
              />
            </Box>
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
