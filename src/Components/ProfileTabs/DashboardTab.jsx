import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardTab = ({ viewsData }) => (
  <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
    <h3 className="mb-6 font-semibold text-2xl dark:text-white">
      Analytics Dashboard
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[
        { label: "Posts", value: "24" },
        { label: "Views", value: "45K" },
        { label: "Reactions", value: "2.3K" },
        { label: "Comments", value: "487" },
      ].map((item, i) => (
        <div
          key={i}
          className="p-5 bg-white dark:bg-bg-primary-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md"
        >
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="text-xl font-bold dark:text-white">{item.value}</p>
        </div>
      ))}
    </div>
    <div className="p-5 bg-white dark:bg-bg-primary-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md">
      <h3 className="mb-4 font-semibold dark:text-white">
        Profile Performance
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={viewsData}>
          <XAxis dataKey="mon" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="followers"
            stroke="#ef4444"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default DashboardTab;
