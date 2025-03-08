
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Hero = () => {
  const navigate = useNavigate();

  const handleBookShipment = () => {
    toast({
      title: "Booking Started",
      description: "Redirecting to route planning...",
    });
    navigate("/routes");
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background via-background to-nexus-blue/20 pb-10 pt-16">
      {/* Abstract background elements */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-nexus-blue/10 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-nexus-purple/10 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-nexus-teal/10 blur-3xl"></div>
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: "linear-gradient(#ffffff11 1px, transparent 1px), linear-gradient(to right, #ffffff11 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      ></div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex animate-fade-in items-center rounded-full bg-white/5 px-4 py-1 text-sm text-nexus-teal backdrop-blur-sm">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-nexus-teal"></span>
            Smart Cross-Border Logistics Platform
          </div>
          
          <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl [animation-delay:200ms]">
            <span className="text-gradient-blue">AI-Powered</span> Logistics
            <br />
            for Global Supply Chain Excellence
          </h1>
          
          <p className="mt-6 animate-fade-in text-lg leading-7 text-muted-foreground [animation-delay:400ms]">
            Streamline your cross-border, multi-modal shipments with intelligent routing,
            real-time visibility, and end-to-end compliance management.
          </p>
          
          <div className="mt-10 flex animate-fade-in flex-col items-center justify-center gap-4 sm:flex-row [animation-delay:600ms]">
            <Button 
              className="nexus-button-primary" 
              size="lg"
              onClick={handleBookShipment}
            >
              Book a Shipment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
