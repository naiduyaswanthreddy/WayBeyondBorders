
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TabsContent } from "@/components/ui/tabs";
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
  
  return (
    <>
      {activeTab === "booking" && <SingleBookingForm className={className} />}
      {activeTab === "multi-stop" && <MultiStopBookingForm className={className} />}
      {activeTab === "shared" && <RideSharingBookingForm className={className} />}
    </>
  );
};

export default BookingForm;
