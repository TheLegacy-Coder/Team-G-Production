import React from "react";
import { PieChart, PieArcSeries } from "reaviz";

export const Charts = () => {
  const categoryData = [
    { key: "A", data: 10 },
    { key: "B", data: 15 },
    { key: "C", data: 20 },
    { key: "D", data: 30 },
  ];
  return (
    <div>
      <h1>Charts</h1>
      <PieChart
        width={350}
        height={250}
        data={categoryData}
        series={<PieArcSeries colorScheme="cybertron" />}
      />
    </div>
  );
};
