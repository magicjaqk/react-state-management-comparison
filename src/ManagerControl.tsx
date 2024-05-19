import React from "react";
import { Manager } from "./App";
import { animate } from "motion";

type Props = {
  setManager: (manager: Manager) => void;
  manager: Manager;
};

const ManagerControl = (props: Props) => {
  const ref = React.useRef<HTMLDivElement>(null!);

  // Initialize sidebar animation
  React.useEffect(() => {
    animate(
      ref.current,
      {
        x: "-100%",
      },
      {
        duration: 0,
      },
    );
  }, []);

  const handleMouseEnter = () => {
    animate(
      ref.current,
      {
        x: "0%",
      },
      {
        duration: 0.5,
        easing: [0.16, 1, 0.3, 1],
      },
    );
  };

  const handleMouseLeave = () => {
    animate(
      ref.current,
      {
        x: "-100%",
      },
      {
        duration: 0.5,
        easing: [0.16, 1, 0.3, 1],
      },
    );
  };

  return (
    <div
      ref={ref}
      className="fixed inset-y-0 left-0 w-40 bg-slate-700 p-4 shadow"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col items-center space-y-2">
        <button
          className={`mr-2 w-full rounded p-2 ${props.manager === "zustand" ? "bg-orange-600" : "bg-slate-600"} transition-colors `}
          onClick={() => props.setManager("zustand")}
        >
          Zustand
        </button>
        <button
          className={`mr-2 w-full rounded  p-2 ${props.manager === "jotai" ? "bg-orange-600" : "bg-slate-600"} transition-colors `}
          onClick={() => props.setManager("jotai")}
        >
          Jotai
        </button>
        <button
          className={`mr-2 w-full rounded p-2 ${props.manager === "valtio" ? "bg-orange-600" : "bg-slate-600"} transition-colors `}
          onClick={() => props.setManager("valtio")}
        >
          Valtio
        </button>
      </div>

      <div className="absolute -right-10 top-2 flex h-10 w-10 items-center justify-center rounded-r-md bg-gray-700">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 12h16M4 6h16M4 18h16"
          />
        </svg>
      </div>
    </div>
  );
};

export default ManagerControl;
