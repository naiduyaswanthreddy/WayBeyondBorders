
import React, { useEffect } from "react";

interface ChatlingChatbotProps {
  chatbotId: string;
  initialMessage?: string;
}

const ChatlingChatbot: React.FC<ChatlingChatbotProps> = ({ 
  chatbotId, 
  initialMessage 
}) => {
  useEffect(() => {
    // Add Chatling script
    if (!document.getElementById("chatling-embed-script")) {
      window.chtlConfig = { chatbotId: chatbotId };
      
      const script = document.createElement("script");
      script.async = true;
      script.id = "chatling-embed-script";
      script.setAttribute("data-id", chatbotId);
      script.type = "text/javascript";
      script.src = "https://chatling.ai/js/embed.js";
      
      document.body.appendChild(script);
      
      // Clean up on unmount
      return () => {
        if (document.getElementById("chatling-embed-script")) {
          document.body.removeChild(document.getElementById("chatling-embed-script")!);
        }
        delete window.chtlConfig;
      };
    }
    
    // Send initial message if provided
    if (initialMessage) {
      // This timeout is needed to ensure the chatbot is loaded before sending the message
      const messageTimeout = setTimeout(() => {
        if (window.ChatlingSDK && typeof window.ChatlingSDK.openChatbot === 'function') {
          window.ChatlingSDK.openChatbot();
          
          // Another small delay to ensure chatbot is fully open
          setTimeout(() => {
            if (window.ChatlingSDK && typeof window.ChatlingSDK.sendMessage === 'function') {
              window.ChatlingSDK.sendMessage(initialMessage);
            }
          }, 1000);
        }
      }, 2000);
      
      return () => clearTimeout(messageTimeout);
    }
  }, [chatbotId, initialMessage]);

  return null; // This component doesn't render anything visible
};

export default ChatlingChatbot;
