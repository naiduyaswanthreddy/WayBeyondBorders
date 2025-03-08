
import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

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

  const handleConfirm = () => {
    if (termsAccepted) {
      onConfirm();
      onOpenChange(false);
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
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
            <AlertDescription>
              By confirming this booking, you acknowledge that you are the primary point of contact for this shipment.
            </AlertDescription>
          </Alert>
          
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
            <AlertDescription>
              Any misleading information or prohibited items found will result in penalties, including potential fines and legal action.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
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
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={!termsAccepted}
            className={!termsAccepted ? "opacity-50 cursor-not-allowed" : ""}
          >
            Confirm Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TermsConfirmationDialog;
