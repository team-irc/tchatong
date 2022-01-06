import { ApexOptions } from "apexcharts";
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

type UseBrushChartReturn<T> = [
  {
    options: ApexOptions;
    series: T[];
    type: ChartType;
    height: string;
  },
  Dispatch<SetStateAction<T[]>>
];

const optionBrush: ApexOptions = {
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

/*
 ** initSeries:
 ** [
 **   {
 **     data: [[날짜X, 밸류Y], [날짜X, 밸류Y]]
 **   }
 ** ]
 */

const useBrushChart = <T extends Object>(
  initSeries: T[]
): UseBrushChartReturn<T> => {
  const [options] = useState<ApexOptions>(optionBrush);
  const [series, setSeries] = useState<T[]>(initSeries);

  return [
    {
      options,
      series,
      type: "area",
      height: "130",
    },
    setSeries,
  ];
};

export default useBrushChart;
