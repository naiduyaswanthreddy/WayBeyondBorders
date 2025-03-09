
import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dangerousGoodsUnderstood, setDangerousGoodsUnderstood] = useState(false);
  const [illegalGoodsChecked, setIllegalGoodsChecked] = useState(false);
  const [chatbotVerifying, setChatbotVerifying] = useState(false);

  const handleSubmit = () => {
    if (!termsAccepted || !dangerousGoodsUnderstood || !illegalGoodsChecked) {
      return;
    }
    onConfirm();
    resetForm();
  };

  const resetForm = () => {
    setTermsAccepted(false);
    setDangerousGoodsUnderstood(false);
    setIllegalGoodsChecked(false);
    setChatbotVerifying(false);
  };

  const openChatbotForVerification = () => {
    setChatbotVerifying(true);
    
    // Open the chatbot interface
    if (window.chtlConfig && typeof window.chtlConfig.chatbotId === 'string') {
      // Find the chat widget button and click it to open the chat
      const chatButton = document.querySelector('.chatling-launcher-button') as HTMLElement;
      if (chatButton) {
        chatButton.click();
        
        // Send initial message to the chatbot
        setTimeout(() => {
          // Try to find the input field and send button
          const chatInput = document.querySelector('.chatling-composer-input textarea') as HTMLTextAreaElement;
          const sendButton = document.querySelector('.chatling-composer-send-button') as HTMLButtonElement;
          
          if (chatInput && sendButton) {
            chatInput.value = "I need to verify my cargo does not contain any illegal or restricted goods. Can you help me with the verification process?";
            // Trigger input event to activate the send button
            const event = new Event('input', { bubbles: true });
            chatInput.dispatchEvent(event);
            sendButton.click();
          }
        }, 1000);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        resetForm();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <ShieldCheck className="h-5 w-5 mr-2 text-nexus-blue" />
            Booking Confirmation
          </DialogTitle>
          <DialogDescription>
            Please review and accept the terms before confirming your booking
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <div className="grid gap-1">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Terms and Conditions
              </label>
              <p className="text-xs text-muted-foreground">
                I accept the terms and conditions for shipping, including payment
                terms, liability limitations, and cancellation policies.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="dangerous-goods"
              checked={dangerousGoodsUnderstood}
              onCheckedChange={(checked) =>
                setDangerousGoodsUnderstood(checked as boolean)
              }
            />
            <div className="grid gap-1">
              <label
                htmlFor="dangerous-goods"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Dangerous Goods Declaration
              </label>
              <p className="text-xs text-muted-foreground">
                I understand the regulations regarding dangerous goods and
                confirm that all items are properly declared and packaged
                according to international shipping standards.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="illegal-goods"
              checked={illegalGoodsChecked}
              onCheckedChange={(checked) =>
                setIllegalGoodsChecked(checked as boolean)
              }
              disabled={!chatbotVerifying}
            />
            <div className="grid gap-1">
              <label
                htmlFor="illegal-goods"
                className={`text-sm font-medium leading-none ${!chatbotVerifying ? 'text-muted-foreground' : 'cursor-pointer'}`}
              >
                Illegal Goods Verification
                {!chatbotVerifying && <span className="ml-2 text-xs text-orange-400">(Requires verification)</span>}
              </label>
              <p className="text-xs text-muted-foreground">
                I confirm that my shipment does not contain any illegal goods, prohibited items, 
                or contraband according to international laws and regulations.
              </p>
            </div>
          </div>

          {!chatbotVerifying ? (
            <Button
              variant="outline"
              className="mt-2 border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
              onClick={openChatbotForVerification}
            >
              <Bot className="mr-2 h-4 w-4" />
              Verify with Chatbot
            </Button>
          ) : (
            <div className="rounded-md bg-green-500/10 border border-green-500/30 p-2 text-xs text-green-400">
              Verification in progress. After consulting with the chatbot, check the box above to confirm.
            </div>
          )}

          <div className="mt-4 rounded-md bg-amber-500/10 border border-amber-500/30 p-3">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-amber-500">Important Notice</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Providing false information regarding the contents of your shipment 
                  may result in legal consequences, fines, or shipment confiscation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 bg-white/5 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!termsAccepted || !dangerousGoodsUnderstood || !illegalGoodsChecked}
            className="bg-nexus-blue hover:bg-nexus-blue/90"
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsConfirmationDialog;
