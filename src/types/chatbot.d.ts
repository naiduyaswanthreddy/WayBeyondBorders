
interface ChatbotConfig {
  chatbotId: string;
}

interface ChatlingSDK {
  openChatbot: () => void;
  closeChatbot: () => void;
  sendMessage: (message: string) => void;
}

declare global {
  interface Window {
    chtlConfig?: ChatbotConfig;
    ChatlingSDK?: ChatlingSDK;
  }
}

export {};
