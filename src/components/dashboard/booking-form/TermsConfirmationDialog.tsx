
import React, { useState } from "react";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ChatlingChatbot from "@/components/chatbot/ChatlingChatbot";

interface TermsConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const TermsConfirmationDialog: React.FC<TermsConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  const [illegalGoodsChecked, setIllegalGoodsChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [safetyChecked, setSafetyChecked] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [botVerified, setBotVerified] = useState(false);
  
  const chatbotId = "1718745342";
  
  const confirmVerification = () => {
    setBotVerified(true);
    setIllegalGoodsChecked(true);
  };

  const handleCheckVerification = () => {
    setShowChatbot(true);
  };
  
  const handleConfirm = () => {
    onConfirm();
    resetState();
  };
  
  const handleCancel = () => {
    onOpenChange(false);
    resetState();
  };
  
  const resetState = () => {
    setIllegalGoodsChecked(false);
    setTermsChecked(false);
    setSafetyChecked(false);
    setShowChatbot(false);
    setBotVerified(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
        <button 
          onClick={handleCancel}
          className="absolute right-4 top-4 text-muted-foreground hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h3 className="text-xl font-semibold text-white">Confirm Booking</h3>
        <p className="mt-2 text-muted-foreground">
          Please confirm the following before proceeding with your booking.
        </p>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="illegal-goods"
              checked={illegalGoodsChecked}
              disabled={!botVerified}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') setIllegalGoodsChecked(checked);
              }}
            />
            <div>
              <label
                htmlFor="illegal-goods"
                className={`text-sm font-medium ${!botVerified ? 'text-muted-foreground' : 'text-white'} cursor-pointer`}
              >
                I confirm that my shipment does not contain illegal or restricted goods
              </label>
              <p className="text-xs text-muted-foreground">
                Including weapons, narcotics, endangered species, or hazardous materials without proper permits
              </p>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-xs"
                onClick={handleCheckVerification}
              >
                Verify with Chatbot
              </Button>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsChecked}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') setTermsChecked(checked);
              }}
            />
            <div>
              <label
                htmlFor="terms"
                className="text-sm font-medium text-white cursor-pointer"
              >
                I have read and agree to the Terms and Conditions
              </label>
              <p className="text-xs text-muted-foreground">
                Including shipping policies, liabilities, and international regulations
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="safety"
              checked={safetyChecked}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') setSafetyChecked(checked);
              }}
            />
            <div>
              <label
                htmlFor="safety"
                className="text-sm font-medium text-white cursor-pointer"
              >
                I confirm that my cargo is properly packaged and labeled
              </label>
              <p className="text-xs text-muted-foreground">
                Following all safety guidelines and transportation requirements
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-end gap-x-3">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!illegalGoodsChecked || !termsChecked || !safetyChecked}
            className="bg-nexus-blue hover:bg-nexus-blue/90"
          >
            Confirm
          </Button>
        </div>
      </div>
      
      {showChatbot && (
        <ChatlingChatbot 
          chatbotId={chatbotId}
          initialMessage="I need to verify my shipment doesn't contain any illegal or restricted goods."
        />
      )}
    </div>
  );
};

export default TermsConfirmationDialog;
