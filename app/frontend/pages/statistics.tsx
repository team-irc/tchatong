import Header from "../layout/header";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChatFireByHour {
  hour: number;
  count: number;
}

interface ChatFireByStreamer {
  streamerNick: string;
  chatLogCount: number;
}

const Statistics = () => {
  const [chatFireByHour, setChatFireByHour] = useState<ChatFireByHour[]>([]);
  const [chatFireByStreamer, setChatFireByStreamer] = useState<ChatFireByStreamer[]>([]);
  const [lineChartOption, setLineChartOption] = useState<ApexOptions>({});
  const [barChartOption, setBarChartOption] = useState<ApexOptions>({})

  useEffect(() => {
    fetch(`${window.origin}/api/statistics/chat-fire/hour`)
      .then(res => res.json())
      .then(res => setChatFireByHour(res))
    fetch(`${window.origin}/api/statistics/chat-fire/streamer`)
      .then(res => res.json())
      .then(res => setChatFireByStreamer(res))
  }, []);

  useEffect(() => {
    setLineChartOption({
      xaxis: {
        categories: chatFireByHour.map(el => `${el.hour}시`),
      },
    })
  }, [chatFireByHour])

  useEffect(() => {
    setBarChartOption({
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: chatFireByStreamer.map(el => `${el.streamerNick}`),
      },
    })
  }, [chatFireByStreamer]);

  return (
    <>
      <Head>
        <title>트채통 | 종합 통계</title>
      </Head>
      <Header>
        <div style={{margin: "5rem auto auto auto", width: "80%"}}>
          <h2>시간대 별 채팅 수</h2>
          <Chart
            options={lineChartOption}
            height={350}
            type="line"
            series={[{name: "채팅 수", data: chatFireByHour.map(el => el.count), color: "#8958d8"}]}
          />
          <h2>한달간 스트리머 별 채팅 수</h2>
          <Chart
            options={barChartOption}
            height={700}
            type="bar"
            series={[{name: "채팅 수", data: chatFireByStreamer.map(el => el.chatLogCount), color: "#8958d8"}]}
          />
        </div>
      </Header>
    </>
  );
}

export default Statistics;