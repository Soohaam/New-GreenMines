import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaUserCircle, FaRobot } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { FaArrowLeft } from 'react-icons/fa';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // For navigation
  const navigate = useNavigate();  // Create navigate instance

  // Inline styles for parsed HTML content
  const htmlStyles = `
    .parsed-html-content h3 {
      font-size: 1.25rem;
      font-weight: bold;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: #66C5CC;
    }
    .parsed-html-content ul {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }
    .parsed-html-content li {
      margin-bottom: 0.5rem;
      color: #ffffff;
    }
    .parsed-html-content p {
      margin-bottom: 0.75rem;
      color: #ffffff;
    }
  `;

  // Render parsed HTML with applied styles
  const renderHTMLContent = (htmlContent) => {
    const cleanHTML = DOMPurify.sanitize(htmlContent); // Sanitize the HTML content

    return (
      <>
        <style>{htmlStyles}</style>
        <div
          className="parsed-html-content"
          dangerouslySetInnerHTML={{ __html: cleanHTML }}
        />
      </>
    );
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      const userMessage = { text: inputMessage, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputMessage('');

      try {
        const response = await axios.post('http://localhost:5000/api/chat', {
          userInput: inputMessage,
        });

        const botMessage = {
          text: response.data.response,
          isUser: false,
          isHTML: true
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = {
          text: "There was an error connecting to the chatbot. Please try again later.",
          isUser: false,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  // Handle pressing Enter to send the message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Scroll to the latest message when the message list updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle the back button functionality
  const handleBack = () => {
    navigate(-1);  // Go back to the previous page
  };

  return (
    <div className="h-screen bg-[#342F49] flex items-center justify-center p-4 md:p-8">
    <div className="w-full h-full md:w-3/4 md:h-screen flex flex-col md:flex-row">
      <button
        onClick={handleBack}
        className="bg-[#2b8d94] text-black font-bold px-4 md:px-8 py-2 md:py-3 text-base md:text-xl rounded-lg mb-4 md:mb-0 md:mt-4 md:self-start flex items-center space-x-2 md:absolute md:top-8 md:left-8"
      >
        <FaArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
        <span>Go Back</span>
      </button>
      <div className="flex flex-col flex-grow md:h-screen w-full bg-[#231E3D] border-[#66C5CC] rounded-lg pt-2">
        {/* Messages Display */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 ml-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot Icon */}
              {!message.isUser && <FaRobot className="text-[#66C5CC] w-4 h-4 md:w-6 md:h-6" />}
              
              <div
                className={`w-auto max-w-full rounded-lg p-2 md:p-3 ${
                  message.isUser
                    ? 'bg-[#66C5CC] text-[#342F49] font-bold'
                    : 'bg-[#342F49] text-white font-bold'
                } shadow-md`}
              >
                <p className="text-sm md:text-base lg:text-xl">
                  {message.isHTML ? renderHTMLContent(message.text) : message.text}
                </p>
              </div>
            
              {/* User Icon */}
              {message.isUser && <FaUserCircle className="text-[#66C5CC] w-4 h-4 md:w-6 md:h-6" />}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="bg-[#3e3177] border-t border-[#66C5CC] px-4 py-4 md:px-6 md:py-6">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 focus:ring-[#66C5CC] focus:border-[#66C5CC] block w-full rounded-md text-base md:text-lg border-[#4da5aa] py-2 md:py-3 px-3 md:px-4 bg-[#231E3D] text-white"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="inline-flex font-bold items-center px-4 md:px-6 py-2 md:py-3 border border-transparent text-base md:text-lg rounded-md shadow-sm text-[#342F49] bg-[#66C5CC] hover:bg-[#4da5aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66C5CC]"
            >
              <FaPaperPlane className="w-4 h-4 md:w-6 md:h-6 mr-2" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
