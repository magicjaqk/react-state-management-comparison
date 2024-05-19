// This might traditionally be multiple files, but this will be a single file in this example for easy cloning.
/**
 * This file is a template for a Chat component. Importantly, prop-drilling is not present at all.
 * No components should pass props down to each other (even if that may be more practical in a real-world
 * scenario). Instead, use jotai, zustand, or valtio to share state and update state across components.
 */

// IMPORTS
import React from "react";

/**
 * Chat component
 */

export const Chat = () => {
  return (
    <div className="relative h-screen w-full">
      <div className="container mx-auto flex h-full flex-col">
        {/* Chat Header -- Displays time and username */}
        <ChatHeader />

        {/* Chat Stream -- Displays text messages with time they were sent at. */}
        <ChatStream />

        {/* Chat Input -- Accepts input */}
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;

/**
 * Additional Components
 */

const ChatHeader = () => {
  return (
    <div className="flex h-16 w-full items-center justify-between border-b border-gray-200">
      <div className="text-lg font-bold">Chat</div>
      <div className="text-sm font-normal">Username | Time</div>
    </div>
  );
};

const ChatStream = () => {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Chat Stream Messages */}
    </div>
  );
};

const ChatInput = () => {
  return (
    <div className="flex h-16 w-full items-center justify-between border-t border-gray-200">
      <input
        className="h-full w-full px-4"
        type="text"
        placeholder="Type a message..."
      />
      <button className="h-full w-16">Send</button>
    </div>
  );
};
