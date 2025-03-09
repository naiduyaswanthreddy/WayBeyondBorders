
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import ChatlingChatbot from "@/components/chatbot/ChatlingChatbot";

interface TermsConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const TermsConfirmationDialog: React.FC<TermsConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [verifiedWithAI, setVerifiedWithAI] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleConfirm = () => {
    if (!agreeTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "You must agree to the terms and conditions before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (!verifiedWithAI) {
      toast({
        title: "AI Verification Required",
        description: "Please verify your shipment details with our AI assistant.",
        variant: "destructive",
      });
      return;
    }

    onConfirm();
    onOpenChange(false);
  };

  const handleVerify = () => {
    setIsChatbotOpen(true);
    setTimeout(() => {
      setVerifiedWithAI(true);
      toast({
        title: "Verification Complete",
        description: "Your shipment details have been verified by our AI assistant.",
      });
    }, 5000);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Booking</DialogTitle>
            <DialogDescription>
              Please review the terms and conditions before confirming your booking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md bg-black/20 p-4 text-sm">
              <p className="mb-2">By confirming this booking, you agree to the following:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All provided information is accurate and complete</li>
                <li>You accept our shipping terms and pricing</li>
                <li>You understand the estimated delivery timeline</li>
                <li>
                  You accept responsibility for any customs duties or taxes applicable to this
                  shipment
                </li>
                <li>
                  You confirm that the cargo does not contain any prohibited or restricted items
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>

              <Button
                variant="outline"
                className="w-full nexus-button-gradient"
                disabled={verifiedWithAI}
                onClick={handleVerify}
              >
                {verifiedWithAI ? "✓ Verified with AI" : "Verify with AI"}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!agreeTerms || !verifiedWithAI}
              className={!agreeTerms || !verifiedWithAI ? "opacity-50" : ""}
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isChatbotOpen && (
        <ChatlingChatbot 
          chatbotId="1718745342" 
          initialMessage="I need to verify my shipment details. Can you help me with the verification process?"
        />
      )}
    </>
  );
};

export default TermsConfirmationDialog;
