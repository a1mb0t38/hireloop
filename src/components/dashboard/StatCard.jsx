"use client";
import React from "react";
import { Card } from "@heroui/react";

export default function StatCard({ title, value, icon: Icon, iconBg = "bg-neutral-800" }) {
  return (
    <Card 
      className="border border-neutral-800 bg-[#121212] text-white p-4 min-h-[160px] flex flex-col justify-between shadow-md" 
    >
      {/* Icon Section */}
      <Card.Header className="p-0 flex items-center justify-start mt-2">
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-neutral-400 ${iconBg}`}>
          {Icon && <Icon size={20} />}
        </div>
      </Card.Header>

      {/* Text / Metric Content Section */}
      <Card.Content className="p-0 mt-4 space-y-2 flex flex-col justify-end text-center">
        <Card.Description className="text-xs font-medium text-neutral-400 tracking-wide m-0">
          {title}
        </Card.Description>
        <Card.Title className="text-3xl font-semibold text-neutral-100 tracking-tight m-0">
          {value}
        </Card.Title>
      </Card.Content>
    </Card>
  );
}