
import React, { useState, useEffect } from "react";
import { PlusCircle, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { CargoItem } from "./types";

// List of illegal or restricted goods names (partial list for demonstration)
const ILLEGAL_GOODS = [
  "weapons", "weapon", "firearm", "firearms", "gun", "guns", "explosive", "explosives", 
  "narcotics", "narcotic", "drugs", "drug", "cocaine", "heroin", "marijuana", "cannabis", 
  "counterfeit", "radioactive", "nuclear", "biological weapon", "chemical weapon",
  "endangered species", "ivory", "rhino horn", "human remains", "human organ",
  "stolen goods", "illegal wildlife", "hazardous waste"
];

interface CargoItemsSectionProps {
  cargoItems: CargoItem[];
  setCargoItems: (items: CargoItem[]) => void;
  onIllegalGoodsDetected?: (detected: boolean) => void;
}

const CargoItemsSection: React.FC<CargoItemsSectionProps> = ({
  cargoItems,
  setCargoItems,
  onIllegalGoodsDetected = () => {},
}) => {
  const [newItemName, setNewItemName] = useState("");
  const [newItemLength, setNewItemLength] = useState("");
  const [newItemWidth, setNewItemWidth] = useState("");
  const [newItemHeight, setNewItemHeight] = useState("");
  const [newItemWeight, setNewItemWeight] = useState("");
  const [illegalItemsDetected, setIllegalItemsDetected] = useState<string[]>([]);

  useEffect(() => {
    // Check all cargo items for illegal goods
    const detected = cargoItems.filter(item => 
      ILLEGAL_GOODS.some(illegalTerm => 
        item.name.toLowerCase().includes(illegalTerm.toLowerCase())
      )
    ).map(item => item.name);
    
    setIllegalItemsDetected(detected);
    onIllegalGoodsDetected(detected.length > 0);
  }, [cargoItems, onIllegalGoodsDetected]);

  const checkForIllegalGoods = (itemName: string): boolean => {
    return ILLEGAL_GOODS.some(illegalTerm => 
      itemName.toLowerCase().includes(illegalTerm.toLowerCase())
    );
  };

  const handleAddCargoItem = () => {
    if (!newItemName || !newItemLength || !newItemWidth || !newItemHeight || !newItemWeight) {
      toast({
        title: "Incomplete Item Details",
        description: "Please fill in all item dimensions and weight",
        variant: "destructive"
      });
      return;
    }
    
    const isIllegal = checkForIllegalGoods(newItemName);
    if (isIllegal) {
      toast({
        title: "Restricted Item Detected",
        description: `"${newItemName}" appears to be a restricted item that cannot be shipped`,
        variant: "destructive"
      });
    }
    
    const newItem = {
      name: newItemName,
      length: newItemLength,
      width: newItemWidth,
      height: newItemHeight,
      weight: newItemWeight
    };
    
    setCargoItems([...cargoItems, newItem]);
    
    setNewItemName("");
    setNewItemLength("");
    setNewItemWidth("");
    setNewItemHeight("");
    setNewItemWeight("");
    
    toast({
      title: "Item Added",
      description: `${newItemName} added to shipment${isIllegal ? " (WARNING: This item may be restricted)" : ""}`
    });
  };

  const removeCargoItem = (index: number) => {
    const updatedItems = [...cargoItems];
    updatedItems.splice(index, 1);
    setCargoItems(updatedItems);
    
    toast({
      title: "Item Removed",
      description: `Removed ${cargoItems[index].name} from shipment`
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
      
      {illegalItemsDetected.length > 0 && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3 mb-3">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-400">Restricted Items Detected</h4>
              <p className="text-xs text-muted-foreground mt-1">
                The following items may be restricted for shipping: 
                <span className="font-semibold text-red-300 ml-1">
                  {illegalItemsDetected.join(", ")}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Please remove these items or verify with the chatbot if they can be shipped.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {cargoItems.length > 0 && (
        <div className="premium-glass overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-2 text-left text-xs font-medium text-muted-foreground">Item</th>
                <th className="p-2 text-left text-xs font-medium text-muted-foreground">Dimensions (L×W×H)</th>
                <th className="p-2 text-left text-xs font-medium text-muted-foreground">Weight</th>
                <th className="p-2 text-right text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {cargoItems.map((item, index) => {
                const isIllegal = ILLEGAL_GOODS.some(term => 
                  item.name.toLowerCase().includes(term.toLowerCase())
                );
                
                return (
                  <tr key={index} className={`${isIllegal ? 'bg-red-500/10' : 'bg-white/5'} hover:bg-white/10 transition-colors`}>
                    <td className="p-2 text-sm">
                      <span className={isIllegal ? 'text-red-300' : 'text-white'}>
                        {item.name}
                        {isIllegal && <AlertTriangle className="inline-block h-3 w-3 ml-1 text-red-400" />}
                      </span>
                    </td>
                    <td className="p-2 text-sm text-white">{item.length}×{item.width}×{item.height} cm</td>
                    <td className="p-2 text-sm text-white">{item.weight} kg</td>
                    <td className="p-2 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-red-300 hover:text-red-200 hover:bg-red-500/20"
                        onClick={() => removeCargoItem(index)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })}
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
