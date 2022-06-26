import { CSSProperties, FC, useEffect, useState } from "react";
import Head from 'next/head'
import Header from "../layout/header";
import styles from "../styles/Statistics.module.css";
import { Box, Card, MenuItem, Select, Badge, CircularProgress } from "@mui/material";
import MostUsedTable from "../components/MostUsedTable";
import useBadge from "../components/hooks/useBadge";
import StatisticsChart from "../components/StatisticsChart";
import { useRouter } from "next/router";
import { Streamer } from "../interfaces/streamer";

function numberWithCommas(num: number): string {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  time: string;
  count: number;
  viewers: number;
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

const Statistics = (): JSX.Element => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [streamerInfo, setStreamerInfo] = useState<Streamer>({
    followers: 0,
    id: 0,
    imageUrl: "",
    nick: "",
    onAir: false,
    streamerId: "",
    streamerLogin: "",
    viewers: 0
  });
  const [streamerId, setStreamerId] = useState<string>("");
  const [candleType, setCandleType] = useState<CandleType>("fiveMinuteCandle");
  const [oneMinuteCandle, setOneMinuteCandle] = useState<ChartData[]>([]);
  const [fiveMinuteCandle, setFiveMinuteCandle] = useState<ChartData[]>([]);
  const [tenMinuteCandle, setTenMinuteCandle] = useState<ChartData[]>([]);
  const [oneHourCandle, setOneHourCandle] = useState<ChartData[]>([]);
  const [currentChatFire, setCurrentChatFire] = useState(0);
  const [dayTopChatFire, setDayTopChatFire] = useState(0);
  const [entireTopChatFire, setEntireTopChatFire] = useState(0);
  const [mostUsedWord, setMostUsedWord] = useState<{word: string, count: number}[]>([]);
  const badgeProps = useBadge(streamerInfo.onAir, 35, 35);

  useEffect(() => {
    if (router.isReady) {
      setStreamerId(router.query.streamerid as string);
    }
  }, [router.isReady, router.query.streamerid]);

  useEffect(() => {
    if (streamerId) {
      setIsReady(false);
      Promise.all([
        // get streamer info
        fetch(`${window.origin}/api/streamer/${streamerId}`)
          .then(res => res.json())
          .then(res => setStreamerInfo(res)),
        // get chat fire chart data
        fetch(`${window.origin}/api/chat-fire/${streamerId}/1`)
          .then(res => res.json())
          .then(res => setOneMinuteCandle(res)),
        fetch(`${window.origin}/api/chat-fire/${streamerId}/5`)
          .then(res => res.json())
          .then(res => setFiveMinuteCandle(res)),
        fetch(`${window.origin}/api/chat-fire/${streamerId}/10`)
          .then(res => res.json())
          .then(res => setTenMinuteCandle(res)),
        fetch(`${window.origin}/api/chat-fire/${streamerId}/60`)
          .then(res => res.json())
          .then(res => setOneHourCandle(res)),
        // get current, day top, entire top chat fire
        fetch(`${window.origin}/api/chat-fire/${streamerId}`)
          .then(res => res.json())
          .then(res => setCurrentChatFire(res.count)),
        fetch(`${window.origin}/api/chat-fire/day-top/${streamerId}`)
          .then(res => res.json())
          .then(res => setDayTopChatFire(res.count)),
        fetch(`${window.origin}/api/chat-fire/entire-top/${streamerId}`)
          .then(res => res.json())
          .then(res => setEntireTopChatFire(res.count)),
        // get most used word
        fetch(`${window.origin}/api/top-word/${streamerId}`)
          .then(res => res.json())
          .then(res => Object.keys(res).map((key) => res[key]))
          .then(res => res.slice(2))
          .then(res => res.map((el, idx) => {
            if (idx % 2 === 1) {
              return {word: el as string, count: res[idx + 1] as number}
            }
          }).filter(Boolean))
          .then(res => setMostUsedWord(res as {count: number, word: string}[]))
      ]).then(() => setIsReady(true));
    }
  }, [streamerId]);

  return (
    <>
      <Head>
        <title>트채통 | {streamerInfo.nick}</title>
      </Head>
      <Header>
        <div style={{position: "relative"}}>
          <div className={`${styles.Loading} ${isReady ? styles.LoadingOff : ""}`}>
            <CircularProgress size="4rem"/>
            <span>잠시만 기다려주세요</span>
          </div>
          <div className={styles.Frame}>
            <Box className={styles.StreamerInfo}>
              <Badge {...(badgeProps as any)}>
                <img
                  src={streamerInfo.imageUrl}
                  className={styles.StreamerImg}
                  alt="streamer avatar image"
                />
              </Badge>
              <span className={styles.StreamerInfoText}>
              <a
                href={`https://www.twitch.tv/${streamerInfo.streamerLogin}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.StreamerNick}
              >
                {streamerInfo.nick}
              </a>
              <br />
              <span className={styles.StreamerFollowers}>
                팔로워: {numberWithCommas(streamerInfo.followers)}명
              </span>
              <br />
              <span className={styles.StreamerCurrentViewers}>
                현재 시청자 수: {numberWithCommas(streamerInfo.viewers)}명
              </span>
            </span>
              <div className={styles.NeonWrapper} style={onAirWrapper}>
                <div
                  className={styles.NeonWrapper}
                  style={streamerInfo.onAir ? onAirNeonWrapper : offAirNeonWrapper}
                >
                  <div
                    className={styles.NeonText}
                    style={streamerInfo.onAir ? onAirNeonText : offAirNeonText}
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
                &#8251;차트 클릭 시 다시보기로 연결됩니다.
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
                data={(() => {
                  switch (candleType) {
                    case "oneMinuteCandle":
                      return oneMinuteCandle;
                    case "fiveMinuteCandle":
                      return fiveMinuteCandle;
                    case "tenMinuteCandle":
                      return tenMinuteCandle;
                    case "oneHourCandle":
                      return oneHourCandle;
                  }
                })()}
                streamerId={streamerInfo.streamerId}
              />
              <Box className={styles.TableBox}>
                <MostUsedTable rows={mostUsedWord} />
                <Box className={styles.CardList}>
                  <StatisticsCard
                    head="현재 채팅 화력🔥"
                    body={`분당 ${currentChatFire}회`}
                    className={styles.CardItem}
                  />
                  <StatisticsCard
                    head="금일 최고 채팅 화력🔥"
                    body={`분당 ${dayTopChatFire}회`}
                    className={styles.CardItem}
                  />
                  <StatisticsCard
                    head="역대 최고 채팅 화력🔥"
                    body={`분당 ${entireTopChatFire}회`}
                    className={styles.CardItem}
                  />
                </Box>
              </Box>
            </Box>
          </div>
        </div>
      </Header>
    </>
  );
};

export default Statistics;
