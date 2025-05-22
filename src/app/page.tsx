"use client";

import { useState, useEffect, useRef } from "react";
import Image from 'next/image';

// Define types for our scenarios and chat messages
type Scenario = {
  id: number;
  title: string;
  description: string;
  script: ChatMessage[];
};

// Updated ChatMessage type with system sender and content types
type ChatMessage = {
  id: number;
  sender: "user" | "bot" | "system";
  message: string;
  explanation?: string;
  contentType?: "text" | "checkboxes" | "table" | "image" | "chart";
  options?: Array<{
    id: string;
    label: string;
    checked?: boolean;
  }>;
  tableData?: {
    headers: string[];
    rows: any[][];
  };
  imageUrl?: string;
  event?: {
    type: string;
    targetMessageId: number;
    optionId: string;
  };
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
      { id: 1, sender: "bot", message: "Dear Mr. Wang, Welcome to HSBC's Insurance Financial Planning Assistant. Could you please tell me what kind of fincial planning you are considering ?", explanation: "Initial greeting to establish rapport with the customer." },
      { 
        id: 2, 
        sender: "system", 
        message: "", 
        explanation: "System provides interactive options for the customer to select their financial planning goal.",
        contentType: "checkboxes",
        options: [
          { id: "protection", label: "Protection" },
          { id: "retirement", label: "Retirement" },
          { id: "education", label: "Child Education" },
          { id: "wealth", label: "Wealth Growth" },
          { id: "legacy", label: "Legacy" }
        ]
      },
      { 
        id: 3, 
        sender: "user", 
        message: "I'm planning my retirement life. Do you have any suggestion ?", 
        explanation: "Customer expresses interest in retirement-related insurance products.",
        event: {
          type: "selectOption",
          targetMessageId: 2,
          optionId: "retirement"
        }
      },
      {
        id: 4,
        sender: "bot",
        message: "To provide you with personalized recommendations, would you authorize us to collect some information about you, e.g demographics, financial information and asset for tailored planning?",
        explanation: "Bot asks for authorization to collect personal information for personalized recommendations."
      },
      {
        id: 5,
        sender: "system",
        message: "",
        explanation: "System provides authorization options for the customer.",
        contentType: "checkboxes",
        options: [
          { id: "yes", label: "Yes, Authorize" },
          { id: "no", label: "No, maybe later" }
        ]
      },
      {
        id: 6,
        sender: "user",
        message: "Yes, Authorize",
        explanation: "Customer authorizes collection of personal information.",
        event: {
          type: "selectOption",
          targetMessageId: 5,
          optionId: "yes"
        }
      },
      {
        id: 7,
        sender: "bot",
        message: "Excellent choice! Retirement planning is vital for your financial future. Let's start with planning.",
        explanation: "Bot acknowledges the customer's choice and begins the retirement planning process."
      },
      {
        id: 8,
        sender: "bot",
        message: "At what age do you plan to retire?",
        explanation: "Bot asks for specific retirement age to provide tailored recommendations."
      },
      {
        id: 9,
        sender: "user",
        message: "I'm planning to start my retirement life from age 55",
        explanation: "Customer provides their planned retirement age."
      },
      {
        id: 10,
        sender: "bot",
        message: "Which city would you prefer to live for your retirement? We also provide details of cost based for your reference for the options below",
        explanation: "Bot asks about retirement location preferences to provide location-specific recommendations."
      },
      {
        id: 11,
        sender: "system",
        message: "",
        explanation: "System provides location options for retirement.",
        contentType: "checkboxes",
        options: [
          { id: "hk", label: "HK local" },
          { id: "gba", label: "GBA cities" },
          { id: "mainland", label: "Other cities in mainland China" },
          { id: "overseas", label: "Overseas" },
          { id: "undecided", label: "Not decided yet" }
        ]
      },
      {
        id: 12,
        sender: "user",
        message: "I would plan to live in Shenzhen when I retire",
        explanation: "Customer indicates their preferred retirement location.",
        event: {
          type: "selectOption",
          targetMessageId: 11,
          optionId: "gba"
        }
      },
      {
        id: 13,
        sender: "bot",
        message: "To help you visualize the retirement life expense in Shenzhen, here's a general guide for retirement lifestyles (in HKD/month):",
      },
      {
        id: 14,
        sender: "system",
        message: "",
        explanation: "System provides retirement plan options.",
        contentType: "checkboxes",
        options: [
          { id: "basic", label: "Basic $10K-15K HKD/month" },
          { id: "comfortable", label: "Comfortable $20K-30K HKD/month" },
          { id: "premium", label: "Premium $30K-50K HKD/month" }
        ]
      },
      {
        id: 15,
        sender: "user",
        message: "I would choose the Comfortable Plan",
        explanation: "Customer selects their preferred retirement plan.",
        event: {
          type: "selectOption",
          targetMessageId: 14,
          optionId: "comfortable"
        }
      },
      {
        id: 16,
        sender: "bot",
        message: "In this following, we'd like to understand your position in terms of: Assets, Liabilities, Income and Expenses.",
      },
      {
        id: 17,
        sender: "user",
        message: "OK",
      },
      {
        id: 18,
        sender: "bot",
        message: "For Saving, we see you have HK$500,000 with HSBC. How much savings do you have in other banks?",
      },
      {
        id: 19,
        sender: "user",
        message: "I have HK$800,000 saving with other banks",
        explanation: "Customer provides other bank account balances."
      },
      {
        id: 20,
        sender: "system",
        message: "",
        explanation: "System provides savings summary in table format.",
        contentType: "table",
        tableData: {
          headers: ["Bank", "Amount (HKD)"],
          rows: [
            ["HSBC", "500,000", { highlight: false }],
            ["Others", "800,000", { highlight: true }],
            ["Total", "1,300,000", { highlight: true }]
          ]
        }
      }
    ]
  }
];

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("9:41");
  
  // Function to update the current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      setCurrentTime(`${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
    };
    
    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
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

  // Function to handle checkbox selection
  const handleCheckboxChange = (messageId: number, optionId: string) => {
    setChatMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId && msg.options) {
          return {
            ...msg,
            options: msg.options.map(opt => ({
              ...opt,
              checked: opt.id === optionId ? true : false
            }))
          };
        }
        return msg;
      })
    );
  };

  // Effect to simulate the chat messages appearing one by one
  useEffect(() => {
    if (!isPlaying || !selectedScenario) return;
    
    if (currentMessageIndex < selectedScenario.script.length) {
      const currentMessage = selectedScenario.script[currentMessageIndex];
      
      if (currentMessage.sender === 'user') {
        // Simulate typing for user messages
        setIsTyping(true);
        let text = '';
        let charIndex = 0;
        
        const typingInterval = setInterval(() => {
          if (charIndex < currentMessage.message.length) {
            text += currentMessage.message[charIndex];
            setTypingText(text);
            charIndex++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            setIsSending(true);
            
            // Simulate sending after typing is complete
            setTimeout(() => {
              setIsSending(false);
              setTypingText("");
              setChatMessages(prev => [...prev, currentMessage]);
              
              // Process any events attached to this message
              if (currentMessage.event && currentMessage.event.type === "selectOption") {
                const { targetMessageId, optionId } = currentMessage.event;
                // Apply the event by updating the checkbox state
                setChatMessages(prevMessages => 
                  prevMessages.map(msg => {
                    if (msg.id === targetMessageId && msg.options) {
                      return {
                        ...msg,
                        options: msg.options.map(opt => ({
                          ...opt,
                          checked: opt.id === optionId ? true : false
                        }))
                      };
                    }
                    return msg;
                  })
                );
              }
              
              setCurrentMessageIndex(prev => prev + 1);
              
              // Scroll to bottom after adding the message
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
              }
            }, 500);
          }
        }, 50); // Speed of typing
        
        return () => clearInterval(typingInterval);
      } else if (currentMessage.sender === 'bot') {
        // For bot messages, show loading indicator first
        setIsLoading(true);
        
        const timer = setTimeout(() => {
          setIsLoading(false);
          setChatMessages(prev => [...prev, currentMessage]);
          setCurrentMessageIndex(prev => prev + 1);
          
          // Scroll to bottom after adding the message
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 1500); // Delay for bot response
        
        return () => clearTimeout(timer);
      } else if (currentMessage.sender === 'system') {
        // For system messages, add them immediately after bot messages
        const timer = setTimeout(() => {
          setChatMessages(prev => [...prev, currentMessage]);
          setCurrentMessageIndex(prev => prev + 1);
          
          // Scroll to bottom after adding the message
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 800); // Shorter delay for system messages
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsPlaying(false);
    }
  }, [isPlaying, currentMessageIndex, selectedScenario]);

  // Remove the existing scroll effect since we're handling it directly in the message addition
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Render system message content based on content type
  // Add this near the beginning of the renderSystemContent function
  const renderSystemContent = (message: ChatMessage) => {
    console.log("Rendering system content for message:", message.id, "with contentType:", message.contentType);
    
    switch (message.contentType) {
      case "checkboxes":
        return (
          <div className="mt-2 space-y-1">
            {message.options?.map(option => (
              <div key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${message.id}-${option.id}`}
                  checked={option.checked || false}
                  onChange={() => handleCheckboxChange(message.id, option.id)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`${message.id}-${option.id}`} className="ml-2 text-sm font-medium text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      case "table":
        console.log("Table data:", message.tableData);
        return (
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {message.tableData?.headers.map((header, index) => {
                    console.log("Rendering header:", header, "at index:", index);
                    return (
                      <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {message.tableData?.rows.map((row, rowIndex) => {
                  console.log("Processing row:", row, "at index:", rowIndex);
                  
                  // Extract highlight object from the row
                  const highlightObj = row.find(item => {
                    console.log("Checking item for highlight:", item, typeof item);
                    return typeof item === 'object' && item !== null && 'highlight' in item;
                  });
                  
                  console.log("Found highlight object:", highlightObj);
                  const isHighlighted = highlightObj ? highlightObj.highlight : false;
                  console.log("Row is highlighted:", isHighlighted);
                  
                  return (
                    <tr key={rowIndex} className={isHighlighted ? 'bg-blue-100' : ''}>
                      {row.map((cell, cellIndex) => {
                        console.log("Processing cell:", cell, "at index:", cellIndex);
                        
                        // Skip rendering the highlight object
                        if (typeof cell === 'object' && cell !== null && 'highlight' in cell) {
                          console.log("Skipping highlight object cell");
                          return null;
                        }
                        
                        return (
                          <td 
                            key={cellIndex} 
                            className={`px-3 py-2 whitespace-nowrap text-sm ${isHighlighted ? 'text-blue-800' : 'text-gray-500'}`}
                          >
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      case "image":
        return (
          <div className="mt-2">
            {message.imageUrl && (
              <Image 
                src={message.imageUrl} 
                alt="System provided image" 
                width={250} 
                height={150} 
                className="rounded-lg"
              />
            )}
          </div>
        );
      default:
        return <p>{message.message}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
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
                    ? 'bg-blue-700 border-2 border-blue-400 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedScenario(scenario)}
              >
                <h3 className="font-bold mb-2">{scenario.title}</h3>
                <p className={`text-sm ${selectedScenario?.id === scenario.id ? 'text-gray-100' : 'text-gray-700'}`}>
                  {scenario.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
            <button 
              onClick={startChat}
              disabled={!selectedScenario || isPlaying}
              className={`flex-1 py-2 px-4 rounded-lg ${
                !selectedScenario || isPlaying 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Start
            </button>
            <button 
              onClick={resetChat}
              disabled={!chatMessages.length}
              className={`flex-1 py-2 px-4 rounded-lg ${
                !chatMessages.length 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Middle panel - 50% on large screens, full width on small screens */}
        <div className="w-full lg:w-1/2 flex justify-center items-start mb-6 lg:mb-0">
          <div className="relative w-[320px] h-[580px] md:w-[375px] md:h-[667px] lg:w-[414px] lg:h-[736px] xl:w-[450px] xl:h-[800px] bg-white rounded-[40px] border-4 border-black overflow-hidden shadow-xl">
            {/* iPhone Side Buttons */}
            {/* Silent Mode Switch */}
            <div className="absolute left-[-8px] top-[50px] w-[8px] h-[25px] bg-gray-700 rounded-l-md shadow-md"></div>
            
            {/* Volume Up Button */}
            <div className="absolute left-[-8px] top-[100px] w-[8px] h-[35px] bg-gray-700 rounded-l-md shadow-md"></div>
            
            {/* Volume Down Button */}
            <div className="absolute left-[-8px] top-[150px] w-[8px] h-[55px] bg-gray-700 rounded-l-md shadow-md"></div>
            
            {/* Power Button */}
            <div className="absolute right-[-8px] top-[120px] w-[8px] h-[55px] bg-gray-700 rounded-r-md shadow-md"></div>
            
            {/* iPhone Status Bar */}
            <div className="relative bg-white text-black h-[48px] flex items-center px-6">
              {/* Time - Left */}
              <div className="absolute left-6 font-semibold text-sm">
                {currentTime}
              </div>
              
              {/* Notch - Center */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-[150px] h-[30px] bg-black rounded-b-[14px] flex justify-center items-end pb-1">
                <div className="w-[10px] h-[10px] bg-gray-800 rounded-full"></div> {/* Camera */}
              </div>
              
              {/* Status Icons - Right */}
              <div className="absolute right-6 flex items-center space-x-1.5">
                {/* 5G Signal */}
                <div className="text-xs font-semibold">5G</div>
                
                {/* WiFi Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 6c4.4 0 8 3.6 8 8h-2c0-3.3-2.7-6-6-6s-6 2.7-6 6H4c0-4.4 3.6-8 8-8zm0 4c2.2 0 4 1.8 4 4h-2c0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.2 1.8-4 4-4z" />
                </svg>
                
                {/* Battery Icon */}
                <div className="relative w-[25px] h-[12px] border border-black rounded-sm flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-[18px] bg-black ml-[1px] my-[1px] rounded-sm"></div>
                  <div className="absolute -right-[2px] top-[3px] bottom-[3px] w-[2px] bg-black rounded-r-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Chat interface */}
            <div className="h-[calc(100%-48px)] flex flex-col">
              {/* Chat messages */}
              <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-white flex flex-col gap-6">
                {chatMessages.length === 0 && !isTyping && !isLoading && (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <p>Select a scenario and press Start to begin the demo</p>
                  </div>
                )}
                
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-end gap-2">
                    {msg.sender === 'user' ? (
                      <div className="max-w-[75%] p-3 rounded-lg bg-blue-100 text-black self-end rounded-br-none ml-auto relative">
                        {msg.message}
                        <div className="absolute right-[-6px] bottom-[6px] w-0 h-0" style={{
                          borderTop: '6px solid transparent',
                          borderLeft: '12px solid rgb(219, 234, 254)', // blue-100 color
                          borderBottom: '6px solid transparent'
                        }}></div>
                      </div>
                    ) : (
                      <div className="max-w-[75%] p-3 rounded-lg bg-gray-100 text-black rounded-bl-none relative">
                        {msg.contentType ? (
                          <>
                            <p className="font-medium mb-1">{msg.message}</p>
                            {renderSystemContent(msg)}
                          </>
                        ) : (
                          msg.message
                        )}
                        <div className="absolute left-[-6px] bottom-[6px] w-0 h-0" style={{
                          borderTop: '6px solid transparent',
                          borderRight: '12px solid #f3f4f6', // gray-100 color
                          borderBottom: '6px solid transparent'
                        }}></div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Loading animation for bot */}
                {isLoading && (
                  <div className="flex items-end gap-2">
                    <div className="max-w-[75%] p-3 rounded-lg bg-gray-100 text-black rounded-bl-none relative">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <div className="absolute left-[-6px] bottom-[6px] w-0 h-0" style={{
                        borderTop: '6px solid transparent',
                        borderRight: '12px solid #f3f4f6', // gray-100 color
                        borderBottom: '6px solid transparent'
                      }}></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat input (disabled for demo) */}
              <div className="p-3 bg-white flex items-center">
                <div className="flex-1 bg-gray-200 text-black rounded-full px-4 py-2 overflow-hidden relative">
                  <div className="whitespace-nowrap overflow-hidden" style={{ 
                    width: '100%',
                    textAlign: 'left',
                    direction: 'rtl',
                    textOverflow: 'clip'
                  }}>
                    <span style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}>
                      {typingText || <span className="text-gray-500">Type your message...</span>}
                    </span>
                  </div>
                </div>
                <button 
                  disabled 
                  className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isSending 
                      ? 'bg-green-600 scale-90' 
                      : 'bg-blue-600 opacity-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - 25% on large screens, hidden on small screens */}
        <div className="w-full lg:w-1/4 hidden lg:block">
          <h2 className="text-xl font-semibold mb-4">Explanation</h2>
          {selectedScenario && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">{selectedScenario.title}</h3>
              <p className="text-sm text-gray-700 mb-4">{selectedScenario.description}</p>
              
              {chatMessages.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm border-b pb-1 mb-2">Current Message:</h4>
                  {chatMessages[chatMessages.length - 1].explanation && (
                    <p className="text-sm text-gray-700">{chatMessages[chatMessages.length - 1].explanation}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
