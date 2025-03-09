
import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MessageCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [illegalGoodsChecked, setIllegalGoodsChecked] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const handleConfirm = () => {
    if (termsAccepted && verificationComplete) {
      onConfirm();
      onOpenChange(false);
    } else if (!verificationComplete) {
      toast({
        title: "Verification Required",
        description: "Please complete the illegal goods verification by consulting with the chatbot.",
        variant: "destructive"
      });
    }
  };

  const handleVerificationCheck = () => {
    if (illegalGoodsChecked) {
      setVerificationComplete(true);
      toast({
        title: "Verification Complete",
        description: "Thank you for verifying your shipment contents.",
      });
    }
  };

  const openChatbot = () => {
    // Trigger chatbot if available
    if (window.chtlConfig) {
      // Attempt to find and click the chatbot button
      const chatbotButtons = document.querySelectorAll('[id^="chatling-"]');
      chatbotButtons.forEach(button => {
        (button as HTMLButtonElement).click();
      });

      toast({
        title: "Chatbot Opened",
        description: "Please verify your shipment contents with the chatbot assistant.",
      });
    } else {
      toast({
        title: "Chatbot Unavailable",
        description: "Please check your shipment manually to ensure compliance with regulations.",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Booking Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            Please review and acknowledge the terms before confirming your booking.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 max-h-60 overflow-y-auto pr-2 space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              By confirming this booking, you acknowledge that you are the primary point of contact for this shipment.
            </AlertDescription>
          </Alert>
          
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Any misleading information or prohibited items found will result in penalties, including potential fines and legal action.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Your booking details are being shared with regulatory authorities, customs, and relevant carriers as required by law.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm space-y-2 bg-background/80 p-4 rounded-md border">
            <h4 className="font-medium">Additional Terms & Conditions:</h4>
            <p>1. You are responsible for ensuring all cargo declarations are accurate and complete.</p>
            <p>2. All dangerous goods must be properly declared according to international regulations.</p>
            <p>3. NexusShip reserves the right to inspect any shipment at any time.</p>
            <p>4. You agree to comply with all applicable laws and regulations related to international trade.</p>
            <p>5. Liability for goods is limited according to standard carrier terms unless additional insurance is purchased.</p>
            <p>6. Payment must be received before shipment processing can begin.</p>
            <p>7. Cancellation policies apply as per the service agreement.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 my-2">
          <Checkbox 
            id="terms" 
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I acknowledge & accept these terms
          </label>
        </div>
        
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-md">
          <h4 className="font-medium text-red-400 mb-2">Required Verification</h4>
          <p className="text-sm text-muted-foreground mb-3">
            All shipments must be verified for illegal goods and banned items. Please confirm you have checked your shipment contents.
          </p>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="illegalGoods" 
                checked={illegalGoodsChecked}
                onCheckedChange={(checked) => setIllegalGoodsChecked(checked === true)}
                disabled={verificationComplete}
              />
              <label
                htmlFor="illegalGoods"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I verify that my shipment does not contain illegal or banned items
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openChatbot}
                disabled={verificationComplete}
                className="text-xs"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Verify with Chatbot
              </Button>
              
              <Button 
                variant={verificationComplete ? "premium-outline" : "premium-blue"}
                size="sm" 
                onClick={handleVerificationCheck}
                disabled={!illegalGoodsChecked || verificationComplete}
                className="text-xs"
              >
                {verificationComplete ? "Verified ✓" : "Mark as Verified"}
              </Button>
            </div>
          </div>
          
          {verificationComplete && (
            <div className="mt-3 text-xs text-green-400">
              Verification complete. Thank you for confirming your shipment contents.
            </div>
          )}
        </div>
        
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={!termsAccepted || !verificationComplete}
            className={!termsAccepted || !verificationComplete ? "opacity-50 cursor-not-allowed" : ""}
          >
            Confirm Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TermsConfirmationDialog;
