"use client";
import React from "react";
import StatCard from "./StatCard";


export default function DashboardStats({ statsData = [] }) {
  return (
    <div className="w-full">
      {/* Responsive layout matches the original layout perfectly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatCard
            key={stat.id || index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBg={stat.iconBg}
          />
        ))}
      </div>
    </div>
  );
}