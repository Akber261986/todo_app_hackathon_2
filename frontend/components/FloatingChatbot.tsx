'use client';

import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useAuth } from '@/lib/auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

type MessageRole = 'user' | 'assistant';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cookies] = useCookies(['token']);
  const { token } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('chatbot_conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })));
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
  }, []);

  // Save conversations to localStorage when they change
  useEffect(() => {
    localStorage.setItem('chatbot_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
    return newConversation;
  };

  const switchToConversation = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      setMessages(conversation.messages);
    }
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversationId === conversationId) {
      const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
      if (remainingConversations.length > 0) {
        switchToConversation(remainingConversations[0].id);
      } else {
        setCurrentConversationId(null);
        setMessages([]);
      }
    }
  };

  const startNewChat = () => {
    createNewConversation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !token) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare the conversation history to send to the backend
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: inputValue,
          conversation_id: currentConversationId || undefined, // Send conversation ID if available
          conversation_history: conversationHistory,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update conversation ID if it's new
      if (data.conversation_id && !currentConversationId) {
        setCurrentConversationId(data.conversation_id);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Update or create conversation
      if (currentConversationId) {
        // Update existing conversation
        setConversations(prev => prev.map(conv =>
          conv.id === currentConversationId
            ? {
              ...conv,
              messages: finalMessages,
              updatedAt: new Date(),
              title: conv.title === 'New Conversation'
                ? inputValue.substring(0, 30) + (inputValue.length > 30 ? '...' : '')
                : conv.title
            }
            : conv
        ));
      } else {
        // Create new conversation
        const newConversation = createNewConversation();
        setConversations(prev => prev.map(conv =>
          conv.id === newConversation.id
            ? { ...newConversation, messages: finalMessages }
            : conv
        ));
        setCurrentConversationId(newConversation.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // For error case, we don't have a conversation_id from the backend
      // but we should still maintain the conversation flow
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        isError: true,
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);

      // Update or create conversation with error message
      if (currentConversationId) {
        setConversations(prev => prev.map(conv =>
          conv.id === currentConversationId
            ? { ...conv, messages: finalMessages, updatedAt: new Date() }
            : conv
        ));
      } else {
        const newConversation = createNewConversation();
        setConversations(prev => prev.map(conv =>
          conv.id === newConversation.id
            ? { ...newConversation, messages: finalMessages }
            : conv
        ));
        setCurrentConversationId(newConversation.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      // If no conversation exists, create one
      if (conversations.length === 0) {
        createNewConversation();
      } else if (!currentConversationId) {
        // Use the most recent conversation
        if (conversations.length > 0) {
          switchToConversation(conversations[0].id);
        }
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 group"
        aria-label="Open chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 group-hover:scale-110 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-md max-h-[70vh] flex flex-col">
          <div className="bg-gradient-to-b from-blue-900/90 to-blue-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 flex flex-col h-full min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 min-h-0">
              {/* Conversation List */}
              <div className="w-1/3 border-r border-white/20 flex flex-col bg-blue-900/30 min-h-0">
                <div className="p-3 flex-shrink-0">
                  <button
                    onClick={startNewChat}
                    className="w-full px-3 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-cyan-500 hover:to-blue-600 transition-all"
                  >
                    + New Chat
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto min-h-0">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 border-b border-white/10 cursor-pointer hover:bg-blue-700/40 transition-colors ${currentConversationId === conversation.id ? 'bg-blue-700/60' : ''
                        }`}
                      onClick={() => switchToConversation(conversation.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">
                            {conversation.title}
                          </div>
                          <div className="text-white/60 text-xs mt-1">
                            {conversation.updatedAt.toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conversation.id);
                          }}
                          className="text-white/50 hover:text-red-400 ml-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="w-3/4 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                  {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-4 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-white mb-2">How can I help you?</h4>
                      <p className="text-blue-100 mb-4">Ask me about your tasks, productivity tips, or anything else!</p>
                      <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setInputValue('How can I manage my tasks better?');
                            // Focus the input field after setting the value
                            setTimeout(() => {
                              if (inputRef.current) {
                                inputRef.current.focus();
                              }
                            }, 0);
                          }}
                          className="text-left px-4 py-3 bg-blue-800/50 rounded-lg text-blue-100 hover:bg-blue-700/60 transition-colors text-sm border border-white/10"
                        >
                          How can I manage my tasks better?
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setInputValue('Show me my pending tasks');
                            // Focus the input field after setting the value
                            setTimeout(() => {
                              if (inputRef.current) {
                                inputRef.current.focus();
                              }
                            }, 0);
                          }}
                          className="text-left px-4 py-3 bg-blue-800/50 rounded-lg text-blue-100 hover:bg-blue-700/60 transition-colors text-sm border border-white/10"
                        >
                          Show me my pending tasks
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setInputValue('What are some productivity tips?');
                            // Focus the input field after setting the value
                            setTimeout(() => {
                              if (inputRef.current) {
                                inputRef.current.focus();
                              }
                            }, 0);
                          }}
                          className="text-left px-4 py-3 bg-blue-800/50 rounded-lg text-blue-100 hover:bg-blue-700/60 transition-colors text-sm border border-white/10"
                        >
                          What are some productivity tips?
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none shadow-md'
                              : message.isError
                                ? 'bg-red-900/50 border border-red-500/50 text-red-100 rounded-bl-none shadow-md'
                                : 'bg-blue-700/50 text-white rounded-bl-none shadow-md'
                              }`}
                          >
                            <div className="text-sm">{message.content}</div>
                            <div
                              className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-white/50'
                                }`}
                            >
                              {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-blue-700/50 text-white rounded-2xl rounded-bl-none px-4 py-3 max-w-[80%] shadow-md">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input - Always visible */}
                <div className="border-t border-white/20 p-2 flex-shrink-0">
                  <form onSubmit={handleSubmit} className='px-2'>
                    <div className='flex gap-2 items-center'>
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={messages.length === 0 ? "Type your message or select a suggestion..." : "Type your message..."}
                        disabled={isLoading}
                        className="flex-1 bg-blue-800/50 border border-white/20 rounded-full px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-w-0 text-sm"
                      />
                      <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="flex-shrink-0 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full p-2 hover:from-cyan-500 hover:to-blue-600 disabled:opacity-50 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;