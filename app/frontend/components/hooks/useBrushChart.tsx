import { ApexOptions } from "apexcharts";
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

interface UseBrushChartReturn<T> {
  options: ApexOptions;
  series: T[];
  type: ChartType;
  height: string;
}

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
        min: new Date("19 Jun 2017").getTime(),
        max: new Date("14 Aug 2017").getTime(),
      },
    },
  },
  colors: ["#008FFB"],
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
  const options = useRef<ApexOptions>(optionBrush);
  const [series, setSeries] = useState<T[]>(initSeries);

  return {
    options: options.current,
    series,
    type: "area",
    height: "130",
  };
};

export default useBrushChart;
