
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Users, TrendingDown, Check, MapPin, Calendar, Package } from "lucide-react";
import { format } from "date-fns";
import { useEcoPoints } from "@/context/EcoPointsContext";
import { toast } from "@/components/ui/use-toast";

export const SharedShipmentsList: React.FC = () => {
  const { sharedShipments } = useEcoPoints();

  if (sharedShipments.length === 0) {
    return (
      <Card className="border-white/10 bg-white/5">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="mb-4 rounded-full bg-white/10 p-3">
            <Share2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-white">No Shared Shipments Yet</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground max-w-md">
            Share your shipments with other customers going to similar destinations to reduce costs and your carbon footprint.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-md">
              <Share2 className="h-4 w-4" />
              Shared Shipments
            </CardTitle>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
              {sharedShipments.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sharedShipments.map((shipment) => (
            <div 
              key={shipment.id} 
              className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              onClick={() => {
                toast({
                  title: "Shipment Details",
                  description: `Shared shipment from ${shipment.origin} to ${shipment.destination}`,
                });
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium flex items-center">
                    <Check className="h-4 w-4 text-green-400 mr-1" />
                    <span>Shared Shipment #{shipment.id.split('-')[1].substring(0, 4)}</span>
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(shipment.date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                  Active
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-md bg-white/5 p-2 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>From</span>
                  </div>
                  <div className="font-medium text-white truncate">{shipment.origin}</div>
                </div>
                <div className="rounded-md bg-white/5 p-2 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>To</span>
                  </div>
                  <div className="font-medium text-white truncate">{shipment.destination}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 p-2 rounded-md">
                  <div className="flex items-center justify-center">
                    <Users className="h-3 w-3 text-blue-400 mr-1" />
                    <span className="text-xs text-muted-foreground">Participants</span>
                  </div>
                  <p className="text-center font-medium text-white text-sm mt-1">{shipment.participants}</p>
                </div>
                
                <div className="bg-white/5 p-2 rounded-md">
                  <div className="flex items-center justify-center">
                    <TrendingDown className="h-3 w-3 text-purple-400 mr-1" />
                    <span className="text-xs text-muted-foreground">Savings</span>
                  </div>
                  <p className="text-center font-medium text-white text-sm mt-1">${shipment.savings}</p>
                </div>
                
                <div className="bg-white/5 p-2 rounded-md">
                  <div className="flex items-center justify-center">
                    <Package className="h-3 w-3 text-orange-400 mr-1" />
                    <span className="text-xs text-muted-foreground">CO₂ Saved</span>
                  </div>
                  <p className="text-center font-medium text-white text-sm mt-1">{shipment.co2Reduction}kg</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
