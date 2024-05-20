// VALTIO -- https://valtio.pmnd.rs/

// For Valtio, we'll create a proxy object that will be our store.
// We can then use the proxy object to read and write to the store.
interface ProxyStore {
  time: string;
  messages: Message[];
}
const store = proxy<ProxyStore>({
  time: "",
  messages: [],
});
function addMessage(message: string) {
  store.messages = [...store.messages, { text: message, time: store.time }];
}

// This might traditionally be multiple files, but this will be a single file in this example for easy cloning.
/**
 * This file is a template for a Chat component. Importantly, prop-drilling is not present at all.
 * No components should pass props down to each other (even if that may be more practical in a real-world
 * scenario). Instead, use jotai, zustand, or valtio to share state and update state across components.
 */

// IMPORTS
import React from "react";
import ChatMessage from "../template/ChatMessage";
import { proxy, useSnapshot } from "valtio";

/**
 * Chat component
 */

export const Chat = () => {
  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col overflow-clip px-4">
      {/* Chat Header -- Displays time and username */}
      <ChatHeader />

      {/* Chat Stream -- Displays text messages with time they were sent at. */}
      <ChatStream />

      {/* Chat Input -- Accepts input */}
      <ChatInput />
    </div>
  );
};

export default Chat;

/**
 * Additional Components
 */

const ChatHeader = () => {
  // Because we'll want to have the time in our messages component, we'll both want to read and write the time state.
  // (Typcially, you might just calculate the time where you're writing it, but for this example, we want to practice reading and writing state across components.)
  // For stateful updates, we can get a snapshot of the store and use it to update the time state in the rendered component.
  const snap = useSnapshot(store);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const dateString = date.toLocaleTimeString();

      // Set the time state to the current time using the state management solution of your choice.
      // With Valtio, we can just write to the store directly.
      store.time = dateString;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-16 w-full flex-shrink-0 items-center justify-center border-b border-slate-600">
      <div className="text-sm font-normal">Username | {snap.time}</div>
    </div>
  );
};

export type Message = {
  text: string;
  time: string;
};
const ChatStream = () => {
  const messages = useSnapshot(store).messages;
  return (
    <div className="relative flex flex-grow flex-col-reverse overflow-clip">
      <div className="max-h-full overflow-scroll">
        {/* Because chat messages don't contain any reactivity, it's pretty simple to just style them directly here without a component (styles won't be used elsewhere) */}
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
    </div>
  );
};

const ChatInput = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        console.log("Enter pressed");

        // Send message logic here -- use jotai, zustand, or valtio to update state
        // We can also create a function to handle adding messages.
        addMessage(inputRef.current?.value || "");
        inputRef.current!.value = "";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="my-4 mb-6 flex h-16 w-full flex-shrink-0 items-center justify-between overflow-hidden rounded-2xl border border-t border-slate-600 bg-slate-600 focus-within:border-slate-100">
      <input
        ref={inputRef}
        className="h-full w-full bg-transparent px-4 text-slate-100 focus:outline-none focus:ring-0"
        type="text"
        placeholder="Type a message..."
      />
      <button
        onClick={() => {
          addMessage(inputRef.current?.value || "");
          inputRef.current!.value = "";
        }}
        className="h-full w-16 bg-orange-600"
      >
        Send
      </button>
    </div>
  );
};
