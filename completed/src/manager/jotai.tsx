// JOTAI -- https://www.jotai.org/

// For Jotai, we'll need to add the provider at the root of our application. The provider can give us access to a store if we need. But usually we'll just use atomic state that is updated at the component level.

// Other than that, we'll create atoms and use them in our components.
// We'll then use the useAtomValue, useSetAtom, and useAtom functions to read and write to the atoms.

// Time Atoms
const timeAtom = atom<string>("");

// Message Atoms
const messagesAtom = atom<Message[]>([]);
// We can use the get function to read the current state of the time atom and use it in our update function.
// That way in our input component, we don't need to worry about getting the time state and rerendering when it changes.
const addMessageAtom = atom(null, (get, set, message: string) => {
  set(messagesAtom, (messages) => [
    ...messages,
    { text: message, time: get(timeAtom) },
  ]);
});

// This might traditionally be multiple files, but this will be a single file in this example for easy cloning.
/**
 * This file is a template for a Chat component. Importantly, prop-drilling is not present at all.
 * No components should pass props down to each other (even if that may be more practical in a real-world
 * scenario). Instead, use jotai, zustand, or valtio to share state and update state across components.
 */

// IMPORTS
import React from "react";
import ChatMessage from "../template/ChatMessage";
import { atom, useAtomValue, useSetAtom } from "jotai"; // Import jotai functions (useAtom is a third function that we won't use in this example)

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
  const time = useAtomValue(timeAtom);
  const setTime = useSetAtom(timeAtom);

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
  const messages: Message[] = useAtomValue(messagesAtom);

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
  const sendMessage = useSetAtom(addMessageAtom);

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
