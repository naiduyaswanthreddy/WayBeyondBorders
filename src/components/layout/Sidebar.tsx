
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  PackageOpen, 
  BarChart3, 
  Map, 
  Truck, 
  CalendarClock, 
  ShieldCheck, 
  DollarSign, 
  Settings, 
  HelpCircle, 
  LogOut 
} from "lucide-react";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const mainItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: PackageOpen, label: "Shipments", href: "/shipments" },
  { icon: Truck, label: "Carriers", href: "/carriers" },
  { icon: Map, label: "Route Planning", href: "/routes" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: CalendarClock, label: "Schedules", href: "/schedules" },
  { icon: ShieldCheck, label: "Compliance", href: "/compliance" },
  { icon: DollarSign, label: "Financials", href: "/financials" },
];

const bottomItems: SidebarItem[] = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/support" },
  { icon: LogOut, label: "Logout", href: "/logout" },
];

const Sidebar = () => {
  const location = useLocation();

  const NavItem = ({ item }: { item: SidebarItem }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        to={item.href}
        className={cn(
          "group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-nexus-blue/20 text-white"
            : "text-muted-foreground hover:bg-white/5 hover:text-white"
        )}
      >
        <div className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200", 
          isActive ? "bg-nexus-blue text-white" : "bg-muted text-muted-foreground group-hover:text-white"
        )}>
          {isActive && (
            <div className="absolute inset-0 animate-pulse rounded-md bg-nexus-blue opacity-50"></div>
          )}
          <Icon className="h-5 w-5" />
        </div>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="fixed bottom-0 left-0 top-16 z-30 w-64 border-r border-white/10 bg-sidebar/80 backdrop-blur-xl">
      <div className="flex h-full flex-col px-3 py-4">
        <nav className="flex-1 space-y-1">
          {mainItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>
        
        <div className="mx-3 my-4 h-[1px] bg-white/10"></div>
        
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
