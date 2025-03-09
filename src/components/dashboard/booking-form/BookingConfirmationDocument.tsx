
import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface BookingConfirmationDocumentProps {
  bookingId: string;
  origin: string;
  destination: string;
  date?: string | null;
  cargoType?: string;
  weight?: string;
  transportMode?: string;
}

const BookingConfirmationDocument: React.FC<BookingConfirmationDocumentProps> = ({
  bookingId,
  origin,
  destination,
  date,
  cargoType,
  weight,
  transportMode
}) => {
  const generatePdf = () => {
    // In a real app, you would use a library like jsPDF to generate a proper PDF
    // This is a simplified version that creates a text file with the booking details
    
    const bookingDetails = `
BOOKING CONFIRMATION
====================
Booking ID: ${bookingId}
Date: ${new Date().toLocaleDateString()}
Status: CONFIRMED

SHIPMENT DETAILS
---------------
Origin: ${origin}
Destination: ${destination}
Shipping Date: ${date || "Not specified"}
Cargo Type: ${cargoType || "Not specified"}
Weight: ${weight || "Not specified"}
Transport Mode: ${transportMode || "Any"}

VERIFICATION
-----------
- Illegal Goods Verification: COMPLETED
- Terms and Conditions: ACCEPTED
- Safety Compliance: VERIFIED

AUTHORIZATION
------------
Authorized by: CodeBlue
Document generated on: ${new Date().toLocaleString()}

This document serves as official confirmation of your booking.
Please keep for your records.
    `;
    
    // Create a blob with the text content
    const blob = new Blob([bookingDetails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger it
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-confirmation-${bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  };
  
  return (
    <Button 
      variant="premium-outline" 
      className="w-full mt-4" 
      onClick={generatePdf}
    >
      <FileDown className="h-4 w-4 mr-2" />
      Download Booking Confirmation
    </Button>
  );
};

export default BookingConfirmationDocument;
