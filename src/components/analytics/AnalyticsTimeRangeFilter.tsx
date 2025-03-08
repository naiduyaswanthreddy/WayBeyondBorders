
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";

interface AnalyticsTimeRangeFilterProps {
  dateRange: string;
  setDateRange: (value: string) => void;
}

const AnalyticsTimeRangeFilter: React.FC<AnalyticsTimeRangeFilterProps> = ({ dateRange, setDateRange }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div></div>
      <div className="flex items-center gap-2">
        <Tabs value={dateRange} onValueChange={setDateRange}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" className="gap-2 border-white/10">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsTimeRangeFilter;
