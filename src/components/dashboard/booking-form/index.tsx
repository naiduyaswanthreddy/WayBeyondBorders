
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TabsContent } from "@/components/ui/tabs";
import SingleBookingForm from "./SingleBookingForm";
import MultiStopBookingForm from "./MultiStopBookingForm";
import RideSharingBookingForm from "./RideSharingBookingForm";
import { BookingFormProps } from "./types";

const BookingForm: React.FC<BookingFormProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState("booking");
  
  return (
    <>
      {activeTab === "booking" && <SingleBookingForm className={className} />}
      {activeTab === "multi-stop" && <MultiStopBookingForm className={className} />}
      {activeTab === "shared" && <RideSharingBookingForm className={className} />}
    </>
  );
};

export default BookingForm;
