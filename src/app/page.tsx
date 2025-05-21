"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Define types for our scenarios and chat messages
type Scenario = {
  id: number;
  title: string;
  description: string;
  script: ChatMessage[];
};

type ChatMessage = {
  id: number;
  sender: "user" | "bot";
  message: string;
  explanation?: string;
};

// Sample scenarios with scripts
const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Life Insurance Planning",
    description: "Explore how life insurance can protect your family's financial future and provide peace of mind during major life transitions.",
    script: [
      { id: 1, sender: "bot", message: "Hello! I'm your insurance planning assistant. How can I help you today?", explanation: "Initial greeting to establish rapport with the customer." },
      { id: 2, sender: "user", message: "I'm interested in life insurance options for my family.", explanation: "Customer expresses interest in life insurance products." },
      { id: 3, sender: "bot", message: "Great! I'd be happy to help. Could you tell me a bit about your family situation?", explanation: "Bot asks qualifying questions to understand customer needs." },
      { id: 4, sender: "user", message: "I'm married with two children, ages 5 and 7.", explanation: "Customer provides family information." },
      { id: 5, sender: "bot", message: "Thank you for sharing. Based on your family situation, I recommend considering a term life policy with coverage of 10-15 times your annual income. This would provide financial security for your children through their college years.", explanation: "Bot provides personalized recommendation based on family composition." },
      { id: 6, sender: "user", message: "That makes sense. What about the cost?", explanation: "Customer inquires about pricing." },
      { id: 7, sender: "bot", message: "For someone in good health, a 20-year term policy with $500,000 coverage typically ranges from $25-45 per month. Would you like me to provide a more detailed quote?", explanation: "Bot provides pricing information and offers next steps." },
    ]
  },
  {
    id: 2,
    title: "Retirement Planning",
    description: "Discover how insurance products can complement your retirement strategy and provide guaranteed income during your golden years.",
    script: [
      { id: 1, sender: "bot", message: "Hello! I'm your insurance planning assistant. How can I help you today?", explanation: "Initial greeting to establish rapport with the customer." },
      { id: 2, sender: "user", message: "I'm thinking about retirement planning and wondering if insurance has a role.", explanation: "Customer expresses interest in retirement-related insurance products." },
      { id: 3, sender: "bot", message: "Absolutely! Insurance can play a crucial role in retirement planning. May I ask how far you are from retirement?", explanation: "Bot confirms insurance relevance and asks qualifying questions." },
      { id: 4, sender: "user", message: "I'm about 15 years away from retirement.", explanation: "Customer provides timeline information." },
      { id: 5, sender: "bot", message: "That's a good planning horizon. For retirement security, you might consider an annuity product that can provide guaranteed income. Fixed indexed annuities offer growth potential with downside protection.", explanation: "Bot recommends specific product type based on customer timeline." },
      { id: 6, sender: "user", message: "How does that differ from just investing in the market?", explanation: "Customer asks for clarification on product benefits." },
      { id: 7, sender: "bot", message: "Unlike market investments, annuities can provide guaranteed income for life, regardless of market performance. This creates a reliable income floor in retirement that you can't outlive. Would you like to explore some specific annuity options?", explanation: "Bot explains key differentiator and value proposition of insurance products for retirement." },
    ]
  }
];

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to start the chat simulation
  const startChat = () => {
    if (!selectedScenario) return;
    
    setChatMessages([]);
    setCurrentMessageIndex(0);
    setIsPlaying(true);
  };

  // Function to reset the chat
  const resetChat = () => {
    setChatMessages([]);
    setIsPlaying(false);
    setCurrentMessageIndex(0);
  };

  // Effect to simulate the chat messages appearing one by one
  useEffect(() => {
    if (!isPlaying || !selectedScenario) return;
    
    if (currentMessageIndex < selectedScenario.script.length) {
      const timer = setTimeout(() => {
        setChatMessages(prev => [...prev, selectedScenario.script[currentMessageIndex]]);
        setCurrentMessageIndex(prev => prev + 1);
      }, 1500); // Delay between messages
      
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [isPlaying, currentMessageIndex, selectedScenario]);

  // Effect to scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Insurance Planner</h1>
      </header>

      {/* Main content */}
      <main className="flex flex-col lg:flex-row flex-1 p-3 md:p-4 gap-4">
        {/* Left panel - 25% on large screens, full width on small screens */}
        <div className="w-full lg:w-1/4 flex flex-col gap-4 mb-6 lg:mb-0">
          <h2 className="text-xl font-semibold mb-2">Select a Scenario</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {scenarios.map(scenario => (
              <div 
                key={scenario.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedScenario?.id === scenario.id 
                    ? 'bg-blue-700 border-2 border-blue-400' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedScenario(scenario)}
              >
                <h3 className="font-bold mb-2">{scenario.title}</h3>
                <p className="text-sm text-gray-300">{scenario.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
            <button 
              onClick={startChat}
              disabled={!selectedScenario || isPlaying}
              className={`flex-1 py-2 px-4 rounded-lg ${
                !selectedScenario || isPlaying 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Start
            </button>
            <button 
              onClick={resetChat}
              disabled={!chatMessages.length}
              className={`flex-1 py-2 px-4 rounded-lg ${
                !chatMessages.length 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Middle panel - 50% on large screens, full width on small screens */}
        <div className="w-full lg:w-1/2 flex justify-center items-start mb-6 lg:mb-0">
          <div className="relative w-[320px] h-[580px] md:w-[375px] md:h-[667px] lg:w-[414px] lg:h-[736px] xl:w-[450px] xl:h-[800px] bg-black rounded-[40px] border-4 border-gray-700 overflow-hidden shadow-xl">
            {/* Chat interface */}
            <div className="h-full flex flex-col">
              {/* Chat header */}
              <div className="bg-gray-800 p-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">IP</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Insurance Planner</p>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
              </div>
              
              {/* Chat messages */}
              <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-white flex flex-col gap-6">
                {chatMessages.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <p>Select a scenario and press Start to begin the demo</p>
                  </div>
                )}
                
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-end gap-2">
                    {msg.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">IP</span>
                      </div>
                    )}
                    
                    <div 
                      className={`max-w-[75%] p-3 rounded-lg relative ${
                        msg.sender === 'bot' 
                          ? 'bg-blue-600 text-white rounded-bl-none' 
                          : 'bg-green-600 text-white self-end rounded-br-none ml-auto'
                      }`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="absolute left-[-8px] bottom-0 w-4 h-4 overflow-hidden">
                          <div className="absolute transform rotate-45 bg-blue-600 w-4 h-4"></div>
                        </div>
                      )}
                      
                      {msg.message}
                      
                      {msg.sender === 'user' && (
                        <div className="absolute right-[-8px] bottom-0 w-4 h-4 overflow-hidden">
                          <div className="absolute transform rotate-45 bg-green-600 w-4 h-4"></div>
                        </div>
                      )}
                    </div>
                    
                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">YOU</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Chat input (disabled for demo) */}
              <div className="p-3 bg-gray-800 flex items-center">
                <input 
                  type="text" 
                  disabled 
                  placeholder="Message is automated in this demo" 
                  className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none"
                />
                <button disabled className="ml-2 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - 25% on large screens, full width on small screens */}
        <div className="w-full lg:w-1/4 bg-gray-900 rounded-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Script Explanation</h2>
          
          {chatMessages.length === 0 ? (
            <p className="text-gray-500">Explanations will appear here as the chat progresses</p>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="border-l-4 border-blue-500 pl-3">
                  <p className="font-semibold text-sm text-blue-400">
                    {msg.sender === 'bot' ? 'Bot' : 'Customer'}: "{msg.message.substring(0, 30)}..."
                  </p>
                  <p className="text-sm text-gray-300 mt-1">{msg.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
