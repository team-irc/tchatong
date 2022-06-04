import { FC, useEffect, useRef, useState } from "react";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartData {
  count: number;
  time: string;
}

interface StatisticsChartProps {
  data: ChartData[];
  streamer_login: string;
}

function chatfireToSeries(chatfire: ChartData[]) {
  return [
    {
      name: "평균 채팅 화력🔥",
      data: chatfire.map((el) => {
        const localTime = new Date(el.time).getTime() + 9 * 60 * 60 * 1000;
        // return [new Date(localTime).toISOString(), el.count];
        return el.count;
      }),
    },
  ];
}

const StatisticsChart: FC<StatisticsChartProps> = ({
  data,
  streamer_login,
}): JSX.Element => {
  const streamer_loginRef = useRef(streamer_login);
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
          fetch(
            `${window.origin}/api/video?streamer_login=${streamer_loginRef.current}&time=${time}`
          )
            .then((res) => res.text())
            .then((res) => {
              if (res === "Video Not Found")
                alert("다시보기를 찾을 수 없습니다.");
              else window.open(res, "_blank");
            });
        },
      },
    },
    colors: ["#8958d8"],
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
    yaxis: {
      forceNiceScale: true,
    },
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
    colors: ["#8958d8"],
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
    yaxis: {
      tickAmount: 2,
    },
  };
  const [series, setSeries] = useState(chatfireToSeries(data));

  useEffect(() => {
    setSeries(chatfireToSeries(data));
  }, [data]);

  useEffect(() => {
    streamer_loginRef.current = streamer_login;
  }, [streamer_login]);

  return (
    <>
      <Chart type="line" series={series} options={option} height="230" />
      <Chart type="area" series={series} options={brush} height="130" />
    </>
  );
};

export default StatisticsChart;
