'use client';

import React, { useState } from 'react';
import { Sparkles, MessageCircle, Search } from 'lucide-react';
import { answerSellingQuestion } from '@/lib/geminiAIService';

interface AIAssistantProps {
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ className = '' }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ question: string; answer: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  // Handle asking a question
  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get answer from AI service
      const response = await answerSellingQuestion(question);
      
      // Update state with new question and answer
      setAnswer(response);
      setHistory([...history, { question, answer: response }]);
      setQuestion('');
    } catch (err) {
      console.error('Error getting answer:', err);
      setError('Failed to get an answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press in input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  // Clear conversation history
  const clearHistory = () => {
    setHistory([]);
    setAnswer('');
  };

  // Suggested questions
  const suggestedQuestions = [
    "What's the best way to optimize my product listings?",
    "How do I choose between Amazon and eBay?",
    "What pricing strategy should I use for my products?",
    "How can I reduce shipping costs?",
    "What's the best inventory management approach?"
  ];

  return (
    <div className={`ai-assistant ${className}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-blue-600" />
            AI Sales Assistant
          </h2>
          <p className="text-gray-600 mt-1">
            Ask me anything about selling products online. I can help with pricing, listing optimization, platform selection, and more.
          </p>
        </div>
        
        <div className="h-96 overflow-y-auto p-6">
          {history.length === 0 && !answer ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Ask me anything</h3>
              <p className="text-gray-500 mb-6">I'm here to help with your e-commerce questions</p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Try asking:</p>
                {suggestedQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuestion(q);
                      setTimeout(() => handleAskQuestion(), 100);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((item, index) => (
                <div key={index}>
                  <div className="flex items-start mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-3 flex-shrink-0">
                      U
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-[85%]">
                      <p>{item.question}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3 flex-shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="bg-blue-50 rounded-lg px-4 py-3 max-w-[85%]">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {answer && !history.some(item => item.answer === answer) && (
                <div>
                  <div className="flex items-start mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-3 flex-shrink-0">
                      U
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-[85%]">
                      <p>{question || "What can you help me with?"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3 flex-shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="bg-blue-50 rounded-lg px-4 py-3 max-w-[85%]">
                      <p>{answer}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3 flex-shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="bg-blue-50 rounded-lg px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about selling online..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2"
                disabled={isLoading}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleAskQuestion}
              disabled={!question.trim() || isLoading}
              className={`px-4 py-2 rounded-lg font-medium ${
                !question.trim() || isLoading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Thinking...' : 'Ask'}
            </button>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
