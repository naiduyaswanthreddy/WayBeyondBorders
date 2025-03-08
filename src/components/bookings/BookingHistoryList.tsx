
import React, { useState } from "react";
import { 
  Package, 
  ChevronRight, 
  Calendar, 
  Map, 
  DollarSign, 
  Truck, 
  AlertCircle, 
  CheckCircle, 
  Clock 
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BookingHistoryProps {
  className?: string;
}

// Sample booking history data
const bookingHistoryData = [
  {
    id: "BK-28375",
    origin: "Shanghai, China",
    destination: "Rotterdam, Netherlands",
    date: "May 15, 2023",
    status: "Delivered",
    routeTaken: "Eco-Friendly Route",
    cost: "$3,450",
    transitTime: "5 days, 6 hours",
    rerouted: false,
    createdAt: "May 10, 2023",
    cargo: {
      type: "Electronics",
      weight: "1,250 kg",
      description: "Consumer electronics, sealed packages"
    },
    timeline: [
      { date: "May 10, 2023", event: "Booking Created", status: "complete" },
      { date: "May 11, 2023", event: "Cargo Picked Up", status: "complete" },
      { date: "May 12, 2023", event: "Departed Shanghai", status: "complete" },
      { date: "May 14, 2023", event: "In Transit", status: "complete" },
      { date: "May 15, 2023", event: "Arrived in Rotterdam", status: "complete" },
      { date: "May 15, 2023", event: "Delivered", status: "complete" }
    ]
  },
  {
    id: "BK-28340",
    origin: "New York, USA",
    destination: "Hamburg, Germany",
    date: "May 8, 2023",
    status: "Delivered",
    routeTaken: "Most Economical",
    cost: "$2,780",
    transitTime: "7 days, 2 hours",
    rerouted: true,
    reroutingEvents: [
      { date: "May 11, 2023", reason: "Severe weather", additionalCost: "$150", delay: "12 hours" }
    ],
    createdAt: "May 2, 2023",
    cargo: {
      type: "Pharmaceuticals",
      weight: "850 kg",
      description: "Temperature controlled medical supplies"
    },
    timeline: [
      { date: "May 2, 2023", event: "Booking Created", status: "complete" },
      { date: "May 3, 2023", event: "Cargo Picked Up", status: "complete" },
      { date: "May 4, 2023", event: "Departed New York", status: "complete" },
      { date: "May 11, 2023", event: "Route Changed: Weather", status: "alert" },
      { date: "May 15, 2023", event: "Arrived in Hamburg", status: "complete" },
      { date: "May 15, 2023", event: "Delivered", status: "complete" }
    ]
  },
  {
    id: "BK-28301",
    origin: "Dubai, UAE",
    destination: "Mumbai, India",
    date: "April 25, 2023",
    status: "Delivered",
    routeTaken: "Fastest Route",
    cost: "$1,950",
    transitTime: "2 days, 5 hours",
    rerouted: false,
    createdAt: "April 22, 2023",
    cargo: {
      type: "Luxury Goods",
      weight: "450 kg",
      description: "High-value merchandise, secured packaging"
    },
    timeline: [
      { date: "April 22, 2023", event: "Booking Created", status: "complete" },
      { date: "April 23, 2023", event: "Cargo Picked Up", status: "complete" },
      { date: "April 23, 2023", event: "Departed Dubai", status: "complete" },
      { date: "April 24, 2023", event: "In Transit", status: "complete" },
      { date: "April 25, 2023", event: "Arrived in Mumbai", status: "complete" },
      { date: "April 25, 2023", event: "Delivered", status: "complete" }
    ]
  }
];

export const BookingHistoryList: React.FC<BookingHistoryProps> = ({ className }) => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  
  const viewBookingDetails = (bookingId: string) => {
    setSelectedBooking(bookingId);
  };

  const createNewShipment = () => {
    navigate('/bookings');
  };

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Booking History</h2>
        <Button onClick={createNewShipment}>New Shipment</Button>
      </div>

      <div className="space-y-4">
        {bookingHistoryData.map((booking) => (
          <div 
            key={booking.id}
            className="rounded-lg border border-white/10 bg-card p-4 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-white/10 p-2">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{booking.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.origin} → {booking.destination}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{booking.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.status === "Delivered" ? (
                      <span className="flex items-center text-green-400">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {booking.status}
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-400">
                        <Clock className="mr-1 h-3 w-3" />
                        {booking.status}
                      </span>
                    )}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => viewBookingDetails(booking.id)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {selectedBooking === booking.id && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details" className="border-white/10">
                    <AccordionTrigger className="text-sm hover:no-underline">
                      Shipment Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <Calendar className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Date Created</p>
                              <p className="text-sm font-medium">{booking.createdAt}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Truck className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Cargo</p>
                              <p className="text-sm font-medium">{booking.cargo.type}</p>
                              <p className="text-xs text-muted-foreground">{booking.cargo.description}</p>
                              <p className="text-xs text-muted-foreground">Weight: {booking.cargo.weight}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <Map className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Route Taken</p>
                              <p className="text-sm font-medium">{booking.routeTaken}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Clock className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Transit Time</p>
                              <p className="text-sm font-medium">{booking.transitTime}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <DollarSign className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Total Cost</p>
                              <p className="text-sm font-medium">{booking.cost}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {booking.rerouted && (
                    <AccordionItem value="rerouting" className="border-white/10">
                      <AccordionTrigger className="text-sm hover:no-underline">
                        <span className="flex items-center text-yellow-400">
                          <AlertCircle className="mr-1 h-3.5 w-3.5" />
                          Rerouting Events
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        {booking.reroutingEvents?.map((event, index) => (
                          <div key={index} className="mb-2 rounded-md bg-yellow-500/10 p-3 border border-yellow-500/20">
                            <p className="text-sm font-medium text-yellow-400">
                              {event.date} - Route Changed
                            </p>
                            <p className="text-xs text-muted-foreground">Reason: {event.reason}</p>
                            <div className="mt-1 flex justify-between">
                              <p className="text-xs text-muted-foreground">Additional Cost: {event.additionalCost}</p>
                              <p className="text-xs text-muted-foreground">Delay: {event.delay}</p>
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  <AccordionItem value="timeline" className="border-white/10">
                    <AccordionTrigger className="text-sm hover:no-underline">
                      Shipment Timeline
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="relative ml-2 space-y-0">
                        {booking.timeline.map((item, index) => (
                          <div key={index} className="relative pb-5">
                            {index !== booking.timeline.length - 1 && (
                              <div className="absolute bottom-0 left-[7px] top-0 w-[1px] bg-white/10"></div>
                            )}
                            <div className="flex gap-3">
                              <div className={`mt-0.5 h-3.5 w-3.5 rounded-full ${
                                item.status === 'complete' 
                                  ? 'bg-green-400' 
                                  : item.status === 'alert' 
                                  ? 'bg-yellow-400'
                                  : 'bg-white/20'
                              }`}></div>
                              <div>
                                <p className="text-sm font-medium text-white">{item.event}</p>
                                <p className="text-xs text-muted-foreground">{item.date}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
