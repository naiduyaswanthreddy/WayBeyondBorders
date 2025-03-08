
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Truck, Package, MapPin, Plus, Clock, AlertTriangle, Info, Check, ArrowRight, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BookingPage = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoType, setCargoType] = useState("general");
  const [isHazmat, setIsHazmat] = useState(false);
  const [isLiquid, setIsLiquid] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [cargoItems, setCargoItems] = useState([{ description: "", weight: "", units: "1" }]);
  const [transportMode, setTransportMode] = useState("any");
  const [showCargoWarning, setShowCargoWarning] = useState(false);

  // List of major ports and logistics hubs
  const locations = [
    "Shanghai, China", 
    "Singapore", 
    "Rotterdam, Netherlands", 
    "Los Angeles, USA", 
    "Busan, South Korea",
    "Dubai, UAE",
    "Mumbai, India",
    "Sydney, Australia",
    "New York, USA",
    "Hamburg, Germany",
    "Tokyo, Japan",
    "Santos, Brazil",
    "Durban, South Africa",
    "Istanbul, Turkey",
    "Vancouver, Canada"
  ];

  // Handle cargo type changes and apply business rules
  const handleCargoTypeChange = (value: string) => {
    setCargoType(value);
    
    if (value === "hazmat") {
      setIsHazmat(true);
      setTransportMode("sea"); // Restrict to sea transport
      setShowCargoWarning(true);
    } else if (value === "liquids") {
      setIsLiquid(true);
      setShowCargoWarning(true);
      if (transportMode === "air") {
        setTransportMode("sea");
      }
    } else if (value === "emergency") {
      setIsEmergency(true);
      setTransportMode("air"); // Prioritize air transport
    } else {
      setIsHazmat(false);
      setIsLiquid(false);
      setIsEmergency(false);
      setShowCargoWarning(false);
    }
  };

  // Handle adding a new cargo item
  const addCargoItem = () => {
    setCargoItems([...cargoItems, { description: "", weight: "", units: "1" }]);
  };

  // Handle updating a cargo item
  const updateCargoItem = (index: number, field: string, value: string) => {
    const updatedItems = [...cargoItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Prevent negative weights
    if (field === "weight" && parseFloat(value) < 0) {
      updatedItems[index].weight = "0";
      toast({
        title: "Invalid weight",
        description: "Weight cannot be negative",
        variant: "destructive",
      });
    }
    
    setCargoItems(updatedItems);
  };

  // Handle removing a cargo item
  const removeCargoItem = (index: number) => {
    const updatedItems = [...cargoItems];
    updatedItems.splice(index, 1);
    if (updatedItems.length === 0) {
      setCargoItems([{ description: "", weight: "", units: "1" }]);
    } else {
      setCargoItems(updatedItems);
    }
  };

  // Handle booking submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Booking created",
      description: "Your shipment has been booked successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="pt-16 pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Book a Shipment
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create a new booking with optimized routing and AI-powered cost recommendations.
            </p>
          </div>
          
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="new">New Booking</TabsTrigger>
              <TabsTrigger value="template">Use Template</TabsTrigger>
              <TabsTrigger value="recurring">Recurring Shipment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="new">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Card className="bg-card border-white/10">
                    <CardHeader>
                      <CardTitle>Shipment Details</CardTitle>
                      <CardDescription>
                        Enter the details of your shipment for AI-optimized routing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Origin */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Origin
                            </label>
                            <div className="relative">
                              <Select onValueChange={setOrigin}>
                                <SelectTrigger className="w-full bg-muted border-white/10">
                                  <SelectValue placeholder="Select origin location" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center px-3 pb-2">
                                    <Search className="mr-2 h-4 w-4" />
                                    <Input 
                                      placeholder="Search locations..." 
                                      className="h-9"
                                    />
                                  </div>
                                  {locations.map((location) => (
                                    <SelectItem key={location} value={location}>
                                      <div className="flex items-center">
                                        <MapPin className="mr-2 h-4 w-4 text-nexus-blue" />
                                        {location}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <MapPin className="absolute right-10 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>

                          {/* Destination */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Destination
                            </label>
                            <div className="relative">
                              <Select onValueChange={setDestination}>
                                <SelectTrigger className="w-full bg-muted border-white/10">
                                  <SelectValue placeholder="Select destination location" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center px-3 pb-2">
                                    <Search className="mr-2 h-4 w-4" />
                                    <Input 
                                      placeholder="Search locations..." 
                                      className="h-9"
                                    />
                                  </div>
                                  {locations.map((location) => (
                                    <SelectItem key={location} value={location}>
                                      <div className="flex items-center">
                                        <MapPin className="mr-2 h-4 w-4 text-nexus-purple" />
                                        {location}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <MapPin className="absolute right-10 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>

                          {/* Date */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Shipping Date
                            </label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className="w-full justify-start border-white/10 bg-muted text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 text-nexus-teal" />
                                  {date ? format(date, "PPP") : <span>Select date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={(date) => date && setDate(date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          {/* Transport Mode */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Transport Mode
                            </label>
                            <Select 
                              value={transportMode} 
                              onValueChange={setTransportMode}
                              disabled={isHazmat || isEmergency}
                            >
                              <SelectTrigger className="w-full bg-muted border-white/10">
                                <SelectValue placeholder="Select transport mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any (AI Optimized)</SelectItem>
                                <SelectItem value="air" disabled={isHazmat || isLiquid}>Air Freight</SelectItem>
                                <SelectItem value="sea">Sea Freight</SelectItem>
                                <SelectItem value="rail">Rail Freight</SelectItem>
                                <SelectItem value="road">Road Transport</SelectItem>
                                {isEmergency && (
                                  <SelectItem value="express">Express Air</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            {showCargoWarning && (
                              <p className="mt-1 flex items-center text-xs text-yellow-400">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                {isHazmat ? "Hazardous materials restricted to sea transport" : "Liquids are restricted for air transport"}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Cargo Type */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Cargo Type
                          </label>
                          <Select value={cargoType} onValueChange={handleCargoTypeChange}>
                            <SelectTrigger className="w-full bg-muted border-white/10">
                              <SelectValue placeholder="Select cargo type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Cargo</SelectItem>
                              <SelectItem value="hazmat">Hazardous Materials</SelectItem>
                              <SelectItem value="perishable">Perishable Goods</SelectItem>
                              <SelectItem value="fragile">Fragile Items</SelectItem>
                              <SelectItem value="electronics">Electronics</SelectItem>
                              <SelectItem value="vehicles">Vehicles</SelectItem>
                              <SelectItem value="liquids">Bulk Liquids</SelectItem>
                              <SelectItem value="powders">Powders</SelectItem>
                              <SelectItem value="emergency">Emergency Goods</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Cargo Items */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-muted-foreground">
                              Cargo Items
                            </label>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-8 gap-1 border-white/10 bg-muted text-xs"
                              onClick={addCargoItem}
                            >
                              <Plus className="h-3 w-3" />
                              Add Item
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            {cargoItems.map((item, index) => (
                              <div key={index} className="grid grid-cols-12 gap-4 rounded-md border border-white/10 bg-white/5 p-3">
                                <div className="col-span-5">
                                  <label className="mb-1 block text-xs text-muted-foreground">
                                    Description
                                  </label>
                                  <Input
                                    value={item.description}
                                    onChange={(e) => updateCargoItem(index, "description", e.target.value)}
                                    placeholder="Item description"
                                    className="h-9 bg-muted border-white/10"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <label className="mb-1 block text-xs text-muted-foreground">
                                    Weight (kg)
                                  </label>
                                  <Input
                                    type="number"
                                    value={item.weight}
                                    onChange={(e) => updateCargoItem(index, "weight", e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="h-9 bg-muted border-white/10"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <label className="mb-1 block text-xs text-muted-foreground">
                                    Units
                                  </label>
                                  <Input
                                    type="number"
                                    value={item.units}
                                    onChange={(e) => updateCargoItem(index, "units", e.target.value)}
                                    placeholder="1"
                                    min="1"
                                    className="h-9 bg-muted border-white/10"
                                  />
                                </div>
                                <div className="col-span-1 flex items-end justify-end">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-muted-foreground hover:text-white"
                                    onClick={() => removeCargoItem(index)}
                                    disabled={cargoItems.length === 1}
                                  >
                                    <AlertTriangle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Special Instructions */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Special Instructions (Optional)
                          </label>
                          <textarea 
                            className="w-full min-h-[100px] rounded-md border border-white/10 bg-muted px-3 py-2 text-white placeholder:text-muted-foreground focus:border-nexus-blue/50 focus:outline-none focus:ring-1 focus:ring-nexus-blue/50"
                            placeholder="Any special requirements or handling instructions"
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit" className="nexus-button-primary">
                            Create Booking
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <div className="space-y-6">
                    {/* Estimated Delivery */}
                    <Card className="bg-card border-white/10">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Estimated Delivery</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {origin && destination ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Estimated Transit Time:</span>
                              <span className="font-medium text-white">3-5 Days</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Estimated Arrival:</span>
                              <span className="font-medium text-white">May 25, 2023</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">AI Confidence:</span>
                              <div className="flex items-center">
                                <span className="mr-2 font-medium text-green-400">High</span>
                                <div className="h-2 w-16 rounded-full bg-white/10">
                                  <div className="h-2 w-14 rounded-full bg-green-400"></div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 rounded-md bg-nexus-blue/10 p-3 border border-nexus-blue/20">
                              <div className="flex">
                                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-nexus-blue" />
                                <div className="ml-2">
                                  <p className="text-xs text-white">Weather forecast clear throughout the route</p>
                                  <p className="text-xs text-muted-foreground">No expected delays from customs or congestion</p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <Clock className="mb-2 h-8 w-8 text-muted-foreground opacity-50" />
                            <p className="text-sm text-muted-foreground">
                              Please select origin and destination to calculate estimated delivery time
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Price Estimate */}
                    <Card className="bg-card border-white/10">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Price Estimate</CardTitle>
                          <span className="rounded-full bg-nexus-teal/20 px-2.5 py-0.5 text-xs font-medium text-nexus-teal">
                            AI Optimized
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {origin && destination ? (
                          <>
                            <div className="mb-4 flex items-center">
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-white">$4,250</span>
                                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                                    Save $320
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  AI-optimized quote based on current market rates
                                </p>
                              </div>
                            </div>
                            
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="cost-breakdown" className="border-white/10">
                                <AccordionTrigger className="text-sm hover:no-underline">
                                  Cost Breakdown
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-2 pt-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-muted-foreground">Freight Charges</span>
                                      <span className="text-xs font-medium">$1,850</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-muted-foreground">Port Handling</span>
                                      <span className="text-xs font-medium">$650</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-muted-foreground">Customs Clearance</span>
                                      <span className="text-xs font-medium">$430</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-muted-foreground">Duty & Taxes</span>
                                      <span className="text-xs font-medium">$780</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-muted-foreground">Insurance</span>
                                      <span className="text-xs font-medium">$320</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-muted-foreground">Documentation</span>
                                      <span className="text-xs font-medium">$220</span>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                                      <span className="text-sm font-medium text-white">Total</span>
                                      <span className="text-sm font-bold text-white">$4,250</span>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="savings" className="border-white/10">
                                <AccordionTrigger className="text-sm hover:no-underline">
                                  Cost Saving Options
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3 pt-2">
                                    <div className="flex items-start rounded-md bg-green-500/10 p-2">
                                      <Check className="mr-2 h-4 w-4 text-green-400" />
                                      <div>
                                        <p className="text-xs font-medium text-white">
                                          Consolidate with other shipments
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          Save $220 by combining with another shipment
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-start rounded-md bg-green-500/10 p-2">
                                      <Check className="mr-2 h-4 w-4 text-green-400" />
                                      <div>
                                        <p className="text-xs font-medium text-white">
                                          Alternate routing via Singapore
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          Save $100 with longer transit (2 days)
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                            
                            <Button className="mt-4 w-full" variant="outline">
                              View Optimization Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <Truck className="mb-2 h-8 w-8 text-muted-foreground opacity-50" />
                            <p className="text-sm text-muted-foreground">
                              Complete shipment details to see AI-optimized pricing
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Route Preview */}
                    <Card className="bg-card border-white/10">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Route Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {origin && destination ? (
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
                            <div className="absolute inset-0 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgIDxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMyNTI5MzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+CiAgPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-30">
                              {/* Origin Point */}
                              <div className="absolute left-[15%] top-[40%] h-3 w-3 rounded-full bg-nexus-blue shadow-[0_0_10px_rgba(0,98,255,0.7)]"></div>
                              
                              {/* Destination Point */}
                              <div className="absolute right-[15%] top-[60%] h-3 w-3 rounded-full bg-nexus-purple shadow-[0_0_10px_rgba(110,54,229,0.7)]"></div>
                              
                              {/* Route Line */}
                              <svg className="absolute inset-0 h-full w-full" style={{ filter: 'drop-shadow(0 0 4px rgba(110, 54, 229, 0.4))' }}>
                                <path
                                  d="M 15% 40% C 40% 30%, 60% 70%, 85% 60%"
                                  stroke="#0062FF" 
                                  strokeWidth="2"
                                  fill="none"
                                  strokeDasharray="6,3"
                                  className="animate-pulse"
                                />
                              </svg>
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-white">{origin}</span>
                                <span className="mx-2 text-muted-foreground">→</span>
                                <span className="text-white">{destination}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <MapPin className="mb-2 h-8 w-8 text-muted-foreground opacity-50" />
                            <p className="text-sm text-muted-foreground">
                              Select origin and destination to preview route
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="template">
              <Card className="bg-card border-white/10">
                <CardHeader>
                  <CardTitle>Saved Templates</CardTitle>
                  <CardDescription>
                    Choose from your saved shipment templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className="flex cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                      >
                        <Package className="mr-4 h-6 w-6 text-nexus-purple" />
                        <div>
                          <h3 className="font-medium">Template {i}</h3>
                          <p className="text-sm text-muted-foreground">Shanghai → Rotterdam</p>
                          <div className="mt-2 flex gap-2">
                            <span className="rounded-full bg-nexus-blue/20 px-2 py-0.5 text-xs text-nexus-blue">Electronics</span>
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">2000kg</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recurring">
              <Card className="bg-card border-white/10">
                <CardHeader>
                  <CardTitle>Recurring Shipments</CardTitle>
                  <CardDescription>
                    Set up regular shipments on a schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-40 items-center justify-center">
                    <div className="text-center">
                      <Clock className="mx-auto mb-2 h-10 w-10 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        Recurring shipments feature coming soon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;
