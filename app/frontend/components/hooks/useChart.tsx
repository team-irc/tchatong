import type { ApexOptions } from "apexcharts";
import { Dispatch, SetStateAction, useRef, useState } from "react";

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
    options: ApexOptions;
    series: T[];
    type: ChartType;
    height: string;
  },
  Dispatch<SetStateAction<T[]>>
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
  colors: ["#546E7A"],
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
  const options = useRef<ApexOptions>(chartOption);
  const [series, setSeries] = useState<T[]>(initSeries);

  return [
    {
      options: options.current,
      series,
      type: "line",
      height: "230",
    },
    setSeries,
  ];
};

export default useChart;
