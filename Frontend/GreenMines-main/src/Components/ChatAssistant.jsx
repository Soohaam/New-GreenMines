import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatAssistant = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chatbot"); // On click, navigate to the /chatbot page
  };

  return (
    // 2697d8
    <div
      className="fixed bottom-24 right-8 w-48 min-h-20 bg-[#201674] text-white font-bold p-3 rounded-lg shadow-lg z-50
                 flex items-center justify-center text-xl text-center cursor-pointer"
      onClick={handleClick}
    >
      {/* Add GIF before the text */}
      <img
        src="Animatio.gif" // Replace this with your desired GIF URL
        alt="Loading..."
        className="w-14 h-14 mr-1" // Adjust size and spacing
      />
      CHAT ASSISTANT
    </div>
  );
};

export default ChatAssistant;
