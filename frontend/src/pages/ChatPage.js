import React from 'react';
import Navbar from '../components/Navbar';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Chat</h1>
        <div className="card">
          <p className="text-gray-600">Chat functionality - Real-time messaging with Socket.IO</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
