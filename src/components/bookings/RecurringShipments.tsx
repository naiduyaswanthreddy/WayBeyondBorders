
import React, { useState } from "react";
import { Calendar, Clock, Package, ArrowRight, CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";

// Sample recurring shipment data
const recurringShipmentData = [
  {
    id: "REC-001",
    name: "Weekly Electronics",
    origin: "Shanghai, China",
    destination: "Rotterdam, Netherlands",
    frequency: "Weekly",
    nextShipment: "May 22, 2023",
    cargoType: "Electronics",
    active: true
  },
  {
    id: "REC-002",
    name: "Monthly Medical Supplies",
    origin: "New York, USA",
    destination: "Hamburg, Germany",
    frequency: "Monthly",
    nextShipment: "June 3, 2023",
    cargoType: "Pharmaceuticals",
    active: true
  },
  {
    id: "REC-003",
    name: "Bi-weekly Auto Parts",
    origin: "Tokyo, Japan",
    destination: "Los Angeles, USA",
    frequency: "Bi-weekly",
    nextShipment: "May 18, 2023",
    cargoType: "Automotive",
    active: false
  }
];

export const RecurringShipments = () => {
  const [shipments, setShipments] = useState(recurringShipmentData);
  const [isCreating, setIsCreating] = useState(false);
  const [newShipment, setNewShipment] = useState({
    name: "",
    origin: "",
    destination: "",
    frequency: "Weekly",
    cargoType: "General"
  });

  const toggleShipmentStatus = (id: string) => {
    setShipments(shipments.map(s => {
      if (s.id === id) {
        const newStatus = !s.active;
        
        toast({
          title: newStatus ? "Recurring Shipment Activated" : "Recurring Shipment Paused",
          description: `${s.name} has been ${newStatus ? 'activated' : 'paused'}.`,
        });
        
        return { ...s, active: newStatus };
      }
      return s;
    }));
  };

  const createRecurringShipment = () => {
    if (!newShipment.name || !newShipment.origin || !newShipment.destination) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate next shipment date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 7);
    const formattedDate = nextDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    // Create new recurring shipment
    const newId = `REC-${(shipments.length + 1).toString().padStart(3, '0')}`;
    
    const createdShipment = {
      id: newId,
      name: newShipment.name,
      origin: newShipment.origin,
      destination: newShipment.destination,
      frequency: newShipment.frequency,
      nextShipment: formattedDate,
      cargoType: newShipment.cargoType,
      active: true
    };
    
    setShipments([...shipments, createdShipment]);
    
    toast({
      title: "Recurring Shipment Created",
      description: `${newShipment.name} has been scheduled.`,
    });
    
    // Reset form
    setNewShipment({
      name: "",
      origin: "",
      destination: "",
      frequency: "Weekly",
      cargoType: "General"
    });
    
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recurring Shipments</h3>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              New Recurring
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Recurring Shipment</DialogTitle>
              <DialogDescription>
                Set up a shipment that automatically repeats on a schedule.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Shipment Name
                </label>
                <Input 
                  value={newShipment.name} 
                  onChange={(e) => setNewShipment({...newShipment, name: e.target.value})}
                  placeholder="Weekly Electronics" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Origin
                  </label>
                  <Input 
                    value={newShipment.origin} 
                    onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                    placeholder="Shanghai, China" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Destination
                  </label>
                  <Input 
                    value={newShipment.destination} 
                    onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                    placeholder="Rotterdam, Netherlands" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Frequency
                  </label>
                  <Select 
                    value={newShipment.frequency} 
                    onValueChange={(value) => setNewShipment({...newShipment, frequency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Cargo Type
                  </label>
                  <Select 
                    value={newShipment.cargoType} 
                    onValueChange={(value) => setNewShipment({...newShipment, cargoType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cargo type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Automotive">Automotive</SelectItem>
                      <SelectItem value="Pharmaceuticals">Pharmaceuticals</SelectItem>
                      <SelectItem value="Perishable">Perishable</SelectItem>
                      <SelectItem value="Hazardous">Hazardous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={createRecurringShipment}>Create Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {shipments.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-white/10 bg-white/5">
          <div className="text-center">
            <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No recurring shipments set up yet</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-2"
              onClick={() => setIsCreating(true)}
            >
              Create your first recurring shipment
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {shipments.map((shipment) => (
            <div 
              key={shipment.id}
              className={`rounded-lg border ${shipment.active ? 'border-white/10' : 'border-white/5 opacity-60'} bg-white/5 p-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`mr-4 rounded-full ${shipment.active ? 'bg-green-500/20' : 'bg-white/10'} p-2`}>
                    <Calendar className={`h-5 w-5 ${shipment.active ? 'text-green-400' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{shipment.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {shipment.origin} → {shipment.destination}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Next Shipment</p>
                    <p className="text-sm font-medium text-white">{shipment.nextShipment}</p>
                    <p className="text-xs text-muted-foreground">{shipment.frequency}</p>
                  </div>
                  <Button 
                    variant={shipment.active ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleShipmentStatus(shipment.id)}
                  >
                    {shipment.active ? (
                      <>
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Active
                      </>
                    ) : (
                      "Activate"
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{shipment.cargoType}</span>
                </div>
                <Button size="sm" variant="ghost" className="gap-1">
                  Details
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
