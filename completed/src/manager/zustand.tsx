// ZUSTAND -- https://docs.pmnd.rs/zustand/getting-started/introduction

// For Zustand, we create our own store that returns a hook.
// We can then use the hook to read and write to the store.
interface StoreInterface {
  time: string;
  messages: Message[];
  updateTime: (time: string) => void;
  addMessage: (message: string) => void;
}
const useZustandStore = create<StoreInterface>()(
  (
    set, // This is a function that allows us to update the store
    get, // This is a function that allows us to read the store
  ) => ({
    time: "",
    messages: [],
    updateTime: (time: string) => set({ time }),
    // With Zustand, we can create side effects that read other parts of the store in our setter functions.
    addMessage: (message: string) =>
      set((state) => ({
        messages: [
          ...state.messages,
          {
            text: message,
            time: state.time,
          },
        ],
      })),
  }),
);

// This might traditionally be multiple files, but this will be a single file in this example for easy cloning.
/**
 * This file is a template for a Chat component. Importantly, prop-drilling is not present at all.
 * No components should pass props down to each other (even if that may be more practical in a real-world
 * scenario). Instead, use jotai, zustand, or valtio to share state and update state across components.
 */

// IMPORTS
import React from "react";
import ChatMessage from "../template/ChatMessage";
import { create } from "zustand";

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
  const [time, setTime] = useZustandStore((state) => [
    state.time,
    state.updateTime,
  ]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const dateString = date.toLocaleTimeString();

      // Set the time state to the current time using the state management solution of your choice.
      setTime(dateString);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-16 w-full flex-shrink-0 items-center justify-center border-b border-slate-600">
      <div className="text-sm font-normal">Username | {time}</div>
    </div>
  );
};

export type Message = {
  text: string;
  time: string;
};
const ChatStream = () => {
  const messages: Message[] = useZustandStore((state) => state.messages);

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
  const sendMessage = useZustandStore((state) => state.addMessage);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        console.log("Enter pressed");

        // Send message logic here -- use jotai, zustand, or valtio to update state
        sendMessage(inputRef.current?.value || "");
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
          sendMessage(inputRef.current?.value || "");
          inputRef.current!.value = "";
        }}
        className="h-full w-16 bg-orange-600"
      >
        Send
      </button>
    </div>
  );
};
