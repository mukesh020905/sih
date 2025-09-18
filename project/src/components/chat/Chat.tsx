import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  chatUser: { _id: string; name: string; profilePicture?: string };
}

interface Message {
  sender: string;
  receiver: string;
  text: string;
  createdAt: string;
}

export const Chat: React.FC<ChatProps> = ({ isOpen, onClose, chatUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && chatUser) {
      // Fetch messages when chat opens
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:5000/api/chat/messages/${chatUser._id}`, {
            headers: {
              'x-auth-token': token || '',
            },
          });
          const data = await res.json();
          if (res.ok) {
            setMessages(data);
          } else {
            console.error('Failed to fetch messages:', data);
          }
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };
      fetchMessages();
    }
  }, [isOpen, chatUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !chatUser) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify({
          receiverId: chatUser._id,
          text: newMessage,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...messages, data]);
        setNewMessage('');
        scrollToBottom();
      } else {
        console.error('Failed to send message:', data);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (!isOpen || !chatUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md flex flex-col h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <img 
              src={chatUser.profilePicture ? `http://localhost:5000${chatUser.profilePicture}` : 'https://via.placeholder.com/50'} 
              alt={chatUser.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <h2 className="text-xl font-semibold text-gray-900">{chatUser.name}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-lg mb-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === chatUser._id ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === chatUser._id ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'}`}>
                <p>{msg.text}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};