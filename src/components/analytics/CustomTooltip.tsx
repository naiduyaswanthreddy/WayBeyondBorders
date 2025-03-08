
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-white/10 bg-black/80 p-3 shadow-md backdrop-blur-sm">
        <p className="text-xs font-medium text-white">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            {entry.name.includes("Cost") || entry.name === "cost" ? " $" : ""}
            {entry.name.includes("CO2") || entry.name === "co2" ? " tons" : ""}
            {entry.name.includes("Time") || entry.name === "time" ? " days" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
