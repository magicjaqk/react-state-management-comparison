import React from "react";
import { Message } from "./Chat";
import { animate } from "motion";
import useMeasure from "react-use-measure";

type Props = {
  message: Message;
};

const ChatMessage = ({ message }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null!);
  const [childRef, childDims] = useMeasure();

  React.useLayoutEffect(() => {
    async function handleAnimate() {
      animate(
        ref.current,
        { height: ["0px", `${childDims.height + 20}px`], opacity: [0, 1] },
        { duration: 0.5, easing: [0.16, 1, 0.3, 1] },
      );
    }
    handleAnimate();
  }, [childDims.height]);

  return (
    <div ref={ref} className="overflow-clip">
      <div
        ref={childRef}
        className="flex w-full flex-col rounded-lg bg-orange-600 px-2 py-4"
      >
        <div className="text-slate-100">{message.text}</div>
        <div className="text-xs text-orange-200">{message.time}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
