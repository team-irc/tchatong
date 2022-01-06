import type { ApexOptions } from "apexcharts";
import { Dispatch, SetStateAction, useState } from "react";

type ChartType =
  | "line"
  | "area"
  | "bar"
  | "histogram"
  | "pie"
  | "donut"
  | "radialBar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "candlestick"
  | "boxPlot"
  | "radar"
  | "polarArea"
  | "rangeBar"
  | "treemap";

type UseLineChartReturn<T> = [
  {
    key: any;
    options: ApexOptions;
    series: T[];
    type: ChartType;
    height: string;
  },
  Dispatch<SetStateAction<T[]>>,
  (newType: "line" | "bar") => void
];

const chartOption: ApexOptions = {
  chart: {
    id: "chartArea",
    toolbar: {
      show: false,
    },
    zoom: {
      autoScaleYaxis: true,
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
  },
  legend: { show: true },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 1,
  },
  markers: {
    size: 0,
  },
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    forceNiceScale: true,
  },
};

/*
 ** initSeries:
 ** [
 **   {
 **     data: [[날짜X, 밸류Y], [날짜X, 밸류Y]]
 **   }
 ** ]
 */

const useChart = <T extends object>(initSeries: T[]): UseLineChartReturn<T> => {
  const [options] = useState<ApexOptions>(chartOption);
  const [series, setSeries] = useState<T[]>(initSeries);
  const [type, setType] = useState<"line" | "bar">("line");

  return [
    {
      key: type,
      options: options,
      series,
      type,
      height: "230",
    },
    setSeries,
    (newType) => {
      setType(newType);
    },
  ];
};

export default useChart;
