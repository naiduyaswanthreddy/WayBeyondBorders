
import React from "react";
import { ArrowRight, Globe, ChevronRight, Zap, Shield, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Hero = () => {
  const navigate = useNavigate();

  const handleBookShipment = () => {
    toast({
      title: "Booking Started",
      description: "Redirecting to booking page...",
    });
    navigate("/bookings");
  };

  return (
    <div className="relative overflow-hidden rounded-xl py-16 lg:py-20">
      {/* Background elements */}
      <div className="absolute inset-0 bg-dot-pattern"></div>
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-nexus-blue/10 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-nexus-purple/10 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-nexus-teal/10 blur-3xl"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 right-1/4 h-24 w-24 rounded-full bg-gradient-to-r from-nexus-blue to-nexus-purple opacity-20 animate-float"></div>
      <div className="absolute bottom-1/4 left-1/3 h-16 w-16 rounded-full bg-gradient-to-r from-nexus-purple to-nexus-pink opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 left-1/4 h-32 w-32 rounded-full bg-gradient-to-r from-nexus-teal to-nexus-blue opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex animate-fade-in items-center rounded-full bg-white/5 px-4 py-1 text-sm text-nexus-teal backdrop-blur-sm border border-white/10">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-nexus-teal"></span>
            <span className="font-medium">Smart Cross-Border Logistics Platform</span>
          </div>
          
          <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl [animation-delay:200ms]">
            <span className="text-gradient-premium">AI-Powered</span> Logistics
            <br />
            for Global Supply Chain Excellence
          </h1>
          
          <p className="mt-6 animate-fade-in text-lg leading-7 text-muted-foreground [animation-delay:400ms]">
            Streamline your cross-border, multi-modal shipments with intelligent routing,
            real-time visibility, and end-to-end compliance management.
          </p>
          
          <div className="mt-10 flex animate-fade-in flex-col items-center justify-center gap-4 sm:flex-row [animation-delay:600ms]">
            <Button 
              variant="premium"
              size="lg"
              className="group"
              onClick={handleBookShipment}
            >
              Book a Shipment
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              variant="premium-outline"
              size="lg"
              className="group"
              onClick={() => navigate("/analytics")}
            >
              View Analytics
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            <div className="premium-glass p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-nexus-blue/20 mb-4">
                <Zap className="h-6 w-6 text-nexus-blue-light" />
              </div>
              <h3 className="text-lg font-semibold">Intelligent Routing</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                AI-optimized routes across sea, air, and land transport modes
              </p>
            </div>
            
            <div className="premium-glass p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-nexus-purple/20 mb-4">
                <Shield className="h-6 w-6 text-nexus-purple-light" />
              </div>
              <h3 className="text-lg font-semibold">Compliance Manager</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Automated customs documentation and regulatory compliance
              </p>
            </div>
            
            <div className="premium-glass p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-nexus-teal/20 mb-4">
                <BarChart2 className="h-6 w-6 text-nexus-teal-light" />
              </div>
              <h3 className="text-lg font-semibold">Financial Analytics</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Real-time cost tracking and optimization recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
