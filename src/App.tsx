import React from "react";
import ZustandChat from "./manager/zustand";
import JotaiChat from "./manager/jotai";
import ValtioChat from "./manager/valtio";
import ManagerControl from "./ManagerControl";
import Chat from "./template/Chat";

export type Manager = "zustand" | "jotai" | "valtio";

const App = () => {
  const [manager, setManager] = React.useState<Manager>("zustand");

  return (
    <div className="relative h-screen w-full bg-slate-800 text-slate-100">
      {/* {manager === "zustand" && <ZustandChat />}
      {manager === "jotai" && <JotaiChat />}
      {manager === "valtio" && <ValtioChat />} */}

      <Chat />

      {/* Manager Control */}

      <ManagerControl manager={manager} setManager={setManager} />
    </div>
  );
};

export default App;
