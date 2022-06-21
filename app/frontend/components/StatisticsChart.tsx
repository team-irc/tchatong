import { FC, useEffect, useRef, useState } from "react";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartData {
  time: string;
  count: number;
  viewers: number;
}

interface StatisticsChartProps {
  data: ChartData[];
  streamerId: string;
}

function chatFireToSeries(chatFire: ChartData[]) {
  return [
    {
      name: "평균 채팅 화력🔥",
      data: chatFire.map((el) => {
        const localTime = new Date(el.time).getTime() + 9 * 60 * 60 * 1000;
        return [new Date(localTime).toISOString(), el.count];
      }),
    },
    {
      name: "평균 시청자 수👨",
      data: chatFire.map((el) => {
        const localTime = new Date(el.time).getTime() + 9 * 60 * 60 * 1000;
        return [new Date(localTime).toISOString(), el.viewers];
      }),
    },
  ];
}

const StatisticsChart: FC<StatisticsChartProps> = ({
  data,
  streamerId,
}): JSX.Element => {
  const streamerIdRef = useRef(streamerId);
  const option: ApexOptions = {
    chart: {
      id: "chartArea",
      toolbar: {
        show: false,
      },
      zoom: {
        autoScaleYaxis: true,
      },
      events: {
        dataPointSelection: (e, chart, options) => {
          const time: number = chart.data.twoDSeriesX[options.dataPointIndex];
          const date = new Date(time)
          fetch(
            `${window.origin}/api/video/${streamerIdRef.current}/${date.setHours(date.getHours() - 9)}`
          )
            .then((res) => res.text())
            .then((res) => {
              if (res === "Can't found video")
                alert("다시보기를 찾을 수 없습니다.");
              else window.open(res, "_blank");
            });
        },
      },
    },
    colors: ["#8958d8","#3B64A1"],
    stroke: {
      width: 3,
    },
    tooltip: {
      x: {
        format: "M월 d일 HH시 mm분",
      },
      intersect: true,
      shared: false,
    },
    legend: { show: true },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: 1.5,
      strokeColors: ["#8958d8"],
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: [{
      title: {
        text: "평균 채팅 화력🔥"
      },
      forceNiceScale: true,
    }, {
      title: {
        text: "평균 시청자 수👨"
      },
      opposite: true,
      forceNiceScale: true,
    }]
  };
  const brush: ApexOptions = {
    chart: {
      id: "chartBrush",
      brush: {
        target: "chartArea",
        enabled: true,
      },
      selection: {
        enabled: true,
        xaxis: {
          min: new Date().getTime() + 3 * 60 * 60 * 1000, // 6시간 전까지 셀렉트함
          max: new Date().getTime() + 9 * 60 * 60 * 1000, // 현재 시간부터
        },
      },
    },
    colors: ["#8958d8", "#3B64A1"],
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      type: "datetime" as "datetime",
      tooltip: {
        enabled: false,
      },
    },
    yaxis: [{
      title: {
        text: "평균 채팅 화력🔥"
      },
      forceNiceScale: true,
    }, {
      title: {
        text: "평균 시청자 수👨"
      },
      opposite: true,
      forceNiceScale: true,
    }]
  };
  const [series, setSeries] = useState(chatFireToSeries(data));

  useEffect(() => {
    setSeries(chatFireToSeries(data));
  }, [data]);

  useEffect(() => {
    streamerIdRef.current = streamerId;
  }, [streamerId]);

  return (
    <>
      <Chart type="line" series={series as any} options={option} height="230" />
      <Chart type="area" series={series as any} options={brush} height="130" />
    </>
  );
};

export default StatisticsChart;
