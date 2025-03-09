
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SingleBookingForm from "./SingleBookingForm";
import MultiStopBookingForm from "./MultiStopBookingForm";
import RideSharingBookingForm from "./RideSharingBookingForm";
import { BookingFormProps } from "./types";

const BookingForm: React.FC<BookingFormProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState("booking");
  
  useEffect(() => {
    // Listen for tab changes from parent component
    const handleTabChange = (event: CustomEvent) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    };
    
    window.addEventListener('bookingTabChange', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('bookingTabChange', handleTabChange as EventListener);
    };
  }, []);

  // Initialize route data for Google Maps
  useEffect(() => {
    const updateRouteInitial = () => {
      const storedBookingData = sessionStorage.getItem('bookingData');
      if (storedBookingData) {
        const bookingData = JSON.parse(storedBookingData);
        const routeData = {
          origin: bookingData.originLabel || bookingData.originInput || "",
          destination: bookingData.destinationLabel || bookingData.destinationInput || "",
          transportMode: bookingData.transportMode || "any",
          isMultiStop: bookingData.isMultiStop || false
        };
        
        const updateEvent = new CustomEvent('routeDataUpdated', { detail: routeData });
        window.dispatchEvent(updateEvent);
      }
    };
    
    // Initial update
    updateRouteInitial();
  }, []);
  
  return (
    <>
      {activeTab === "booking" && <SingleBookingForm className={className} />}
      {activeTab === "multi-stop" && <MultiStopBookingForm className={className} />}
      {activeTab === "shared" && <RideSharingBookingForm className={className} />}
    </>
  );
};

export default BookingForm;
