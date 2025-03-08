
import React from "react";
import { cn } from "@/lib/utils";
import { CreditCard, DollarSign, Clock, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CostBreakdownProps {
  className?: string;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ className }) => {
  const costs = [
    { name: "Freight Charges", customer: 1850, company: 1650, percent: 45 },
    { name: "Port Handling", customer: 650, company: 580, percent: 15 },
    { name: "Customs Clearance", customer: 430, company: 410, percent: 10 },
    { name: "Duty & Taxes", customer: 780, company: 780, percent: 18 },
    { name: "Insurance", customer: 320, company: 280, percent: 8 },
    { name: "Documentation", customer: 220, company: 180, percent: 4 },
  ];

  const totalCustomer = costs.reduce((acc, cost) => acc + cost.customer, 0);
  const totalCompany = costs.reduce((acc, cost) => acc + cost.company, 0);
  const profit = totalCustomer - totalCompany;
  const marginPercent = Math.round((profit / totalCustomer) * 100);

  return (
    <div className={cn("nexus-card-teal p-6", className)}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Cost Breakdown</h2>
        <span className="rounded-full bg-nexus-teal/20 px-3 py-1 text-xs font-medium text-nexus-teal">
          AI Optimized
        </span>
      </div>

      <div className="space-y-6">
        {/* Cost Bars */}
        <div className="space-y-4">
          {costs.map((cost, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{cost.name}</span>
                <span className="font-medium text-white">${cost.customer}</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-nexus-teal/80"
                  style={{ width: `${cost.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm border border-white/10">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Customer Cost</h3>
              <CreditCard className="h-4 w-4 text-nexus-teal" />
            </div>
            <p className="text-2xl font-bold text-white">${totalCustomer}</p>
          </div>

          <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm border border-white/10">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Company Cost</h3>
              <DollarSign className="h-4 w-4 text-nexus-purple" />
            </div>
            <p className="text-2xl font-bold text-white">${totalCompany}</p>
          </div>

          <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm border border-white/10">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Profit Margin</h3>
              <Clock className="h-4 w-4 text-nexus-blue" />
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-white">${profit}</p>
              <span className="text-sm font-medium text-green-400">+{marginPercent}%</span>
            </div>
          </div>
        </div>

        {/* Optimization Notice */}
        <div className="rounded-lg bg-nexus-blue/10 p-4 border border-nexus-blue/20">
          <div className="flex">
            <Info className="mr-3 h-5 w-5 flex-shrink-0 text-nexus-blue" />
            <div>
              <h4 className="text-sm font-medium text-white">AI Cost Optimization</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Our AI has identified potential savings of $320 through alternative routing and carrier selection.
              </p>
              <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs text-nexus-blue">
                View optimization details
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdown;
