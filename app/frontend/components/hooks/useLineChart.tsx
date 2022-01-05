import type { ApexOptions } from "apexcharts";
import { useRef, useState } from "react";

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

interface UseLineChartReturn<T> {
  options: ApexOptions;
  series: T[];
  type: ChartType;
  height: string;
}

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

const useLineChart = <T extends object>(
  initSeries: T[]
): UseLineChartReturn<T> => {
  const options = useRef<ApexOptions>(chartOption);
  const [series] = useState<T[]>(initSeries);

  return {
    options: options.current,
    series,
    type: "line",
    height: "230",
  };
};

export default useLineChart;
