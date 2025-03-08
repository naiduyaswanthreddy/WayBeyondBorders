
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Settings, 
  Search, 
  HelpCircle, 
  User, 
  Globe, 
  ChevronDown,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Navbar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search submitted",
        description: `Searching for: ${searchQuery}`,
      });
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const clearNotifications = () => {
    setNotificationCount(0);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read.",
    });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-x-6">
          <Link to="/" className="flex items-center gap-x-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-nexus-blue">
              <div className="absolute inset-0 animate-pulse rounded-md bg-nexus-blue opacity-50"></div>
              <Globe className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gradient-blue">Way</span>
              <span className="text-white">Beyond</span>
              <span className="text-gradient-teal">Borders</span>
            </span>
          </Link>

          {searchOpen ? (
            <form 
              onSubmit={handleSearchSubmit}
              className="ml-6 flex w-full max-w-lg items-center rounded-md bg-muted"
            >
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search routes, shipments, carriers..."
                className="w-full bg-transparent py-1.5 px-3 text-sm focus:outline-none"
                autoFocus
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-white"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </form>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-6 hidden text-muted-foreground hover:text-white md:flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-x-8">
            <li>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors duration-200 ${isActive('/dashboard') ? 'text-nexus-blue' : 'text-white hover:text-nexus-blue'}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/bookings" 
                className={`text-sm font-medium transition-colors duration-200 ${isActive('/bookings') ? 'text-nexus-blue' : 'text-white hover:text-nexus-blue'}`}
              >
                Bookings
              </Link>
            </li>
            <li>
              <Link 
                to="/analytics" 
                className={`text-sm font-medium transition-colors duration-200 ${isActive('/analytics') ? 'text-nexus-blue' : 'text-white hover:text-nexus-blue'}`}
              >
                Analytics
              </Link>
            </li>
            <li>
              <Link 
                to="/integrations" 
                className={`text-sm font-medium transition-colors duration-200 ${isActive('/integrations') ? 'text-nexus-blue' : 'text-white hover:text-nexus-blue'}`}
              >
                Integrations
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-white">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-nexus-purple text-xs font-semibold text-white">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <h3 className="font-medium">Notifications</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-muted-foreground hover:text-white"
                  onClick={clearNotifications}
                >
                  Clear all
                </Button>
              </div>
              <div className="space-y-1 p-4">
                <div className="rounded-md p-3 hover:bg-white/5">
                  <p className="text-sm font-medium">Route optimization complete</p>
                  <p className="text-xs text-muted-foreground">Your shipment from Shanghai to Rotterdam has been optimized.</p>
                  <p className="mt-1 text-xs text-nexus-blue">5 minutes ago</p>
                </div>
                <div className="rounded-md p-3 hover:bg-white/5">
                  <p className="text-sm font-medium">Weather alert</p>
                  <p className="text-xs text-muted-foreground">Potential delays due to storms near Singapore port.</p>
                  <p className="mt-1 text-xs text-nexus-purple">1 hour ago</p>
                </div>
                <div className="rounded-md p-3 hover:bg-white/5">
                  <p className="text-sm font-medium">Cost saving opportunity</p>
                  <p className="text-xs text-muted-foreground">AI has identified potential savings of $320 on your recent bookings.</p>
                  <p className="mt-1 text-xs text-nexus-teal">3 hours ago</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="border-b border-white/10 p-4">
                <h3 className="font-medium">Help & Resources</h3>
              </div>
              <div className="space-y-2 p-4">
                <Button variant="ghost" className="w-full justify-start text-sm">View Tutorial</Button>
                <Button variant="ghost" className="w-full justify-start text-sm">Documentation</Button>
                <Button variant="ghost" className="w-full justify-start text-sm">Contact Support</Button>
                <Button variant="ghost" className="w-full justify-start text-sm">FAQs</Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>

          <div className="ml-2 h-8 w-[1px] bg-white/10"></div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-white/10 bg-muted hover:bg-muted/80">
                <User className="h-4 w-4" />
                <span>John Doe</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <div className="border-b border-white/10 p-4">
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john.doe@example.com</p>
              </div>
              <div className="space-y-1 p-2">
                <Button variant="ghost" className="w-full justify-start text-sm">View Profile</Button>
                <Button variant="ghost" className="w-full justify-start text-sm">Account Settings</Button>
                <Button variant="ghost" className="w-full justify-start text-sm">Subscription</Button>
              </div>
              <div className="border-t border-white/10 p-2">
                <Button variant="ghost" className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10">
                  Log Out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
