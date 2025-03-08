
import React, { useState } from "react";
import { PlusCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { CargoItem } from "./types";

interface CargoItemsSectionProps {
  cargoItems: CargoItem[];
  setCargoItems: (items: CargoItem[]) => void;
}

const CargoItemsSection: React.FC<CargoItemsSectionProps> = ({
  cargoItems,
  setCargoItems,
}) => {
  const [newItemName, setNewItemName] = useState("");
  const [newItemLength, setNewItemLength] = useState("");
  const [newItemWidth, setNewItemWidth] = useState("");
  const [newItemHeight, setNewItemHeight] = useState("");
  const [newItemWeight, setNewItemWeight] = useState("");

  const handleAddCargoItem = () => {
    if (!newItemName || !newItemLength || !newItemWidth || !newItemHeight || !newItemWeight) {
      toast({
        title: "Incomplete Item Details",
        description: "Please fill in all item dimensions and weight",
        variant: "destructive"
      });
      return;
    }
    
    setCargoItems([
      ...cargoItems,
      {
        name: newItemName,
        length: newItemLength,
        width: newItemWidth,
        height: newItemHeight,
        weight: newItemWeight
      }
    ]);
    
    setNewItemName("");
    setNewItemLength("");
    setNewItemWidth("");
    setNewItemHeight("");
    setNewItemWeight("");
    
    toast({
      title: "Item Added",
      description: `${newItemName} added to shipment`
    });
  };

  return (
    <div className="col-span-2 mt-4 space-y-4 premium-glass p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Package className="h-5 w-5 text-nexus-purple-light mr-2" />
          <h3 className="text-md font-medium text-white">Cargo Items</h3>
        </div>
        <span className="premium-pill-purple">
          {cargoItems.length} items added
        </span>
      </div>
      
      {cargoItems.length > 0 && (
        <div className="premium-glass overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-2 text-left text-xs font-medium text-muted-foreground">Item</th>
                <th className="p-2 text-left text-xs font-medium text-muted-foreground">Dimensions (L×W×H)</th>
                <th className="p-2 text-left text-xs font-medium text-muted-foreground">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {cargoItems.map((item, index) => (
                <tr key={index} className="bg-white/5 hover:bg-white/10 transition-colors">
                  <td className="p-2 text-sm text-white">{item.name}</td>
                  <td className="p-2 text-sm text-white">{item.length}×{item.width}×{item.height} cm</td>
                  <td className="p-2 text-sm text-white">{item.weight} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="grid grid-cols-6 gap-2">
        <Input
          className="col-span-2 nexus-input"
          placeholder="Item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <Input
          className="nexus-input"
          placeholder="Length (cm)"
          value={newItemLength}
          onChange={(e) => setNewItemLength(e.target.value)}
          type="number"
        />
        <Input
          className="nexus-input"
          placeholder="Width (cm)"
          value={newItemWidth}
          onChange={(e) => setNewItemWidth(e.target.value)}
          type="number"
        />
        <Input
          className="nexus-input"
          placeholder="Height (cm)"
          value={newItemHeight}
          onChange={(e) => setNewItemHeight(e.target.value)}
          type="number"
        />
        <Input
          className="nexus-input"
          placeholder="Weight (kg)"
          value={newItemWeight}
          onChange={(e) => setNewItemWeight(e.target.value)}
          type="number"
        />
      </div>
      
      <Button 
        variant="premium-purple"
        className="w-full"
        onClick={handleAddCargoItem}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};

export default CargoItemsSection;
