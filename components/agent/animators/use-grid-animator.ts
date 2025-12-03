import { AgentState } from "@/data/agent";
import { useEffect, useState } from "react";
import {
  GridAnimationOptions,
  GridAnimatorState,
} from "@/components/agent/agent-control-bar";
import { generateConnectingSequence } from "@/components/agent/animation-sequences/connecting-sequence";
import { generateListeningSequence } from "@/components/agent/animation-sequences/listening-sequence";
import { generateThinkingSequence } from "@/components/agent/animation-sequences/thinking-sequence";

export const useGridAnimator = (
  type: AgentState,
  rows: number,
  columns: number,
  interval: number,
  state: GridAnimatorState,
  animationOptions?: GridAnimationOptions,
): { x: number; y: number } => {
  const [index, setIndex] = useState(0);
  const [sequence, setSequence] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    let newSequence: { x: number; y: number }[] = [];

    const isAgentState = (val: string): val is AgentState => {
      return ["active", "idle", "listening", "error", "thinking", "connecting"].includes(val);
    };

    if (!isAgentState(type)) {
      setSequence([]);
      return;
    }

    switch (type) {
   

      
      case "listening":
        newSequence = generateListeningSequence(rows, columns);
        break;
      case "active":
      case "idle":
      case "error":
        newSequence = [];
        break;
    }

    setSequence(newSequence);
    setIndex(0);
  }, [type, rows, columns, state, animationOptions?.connectingRing]);

  useEffect(() => {
    if (state === "paused") return;

    const intervalId = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval, rows, columns, state, type, sequence.length]);

  if (sequence.length === 0) return { x: 0, y: 0 };

  return sequence[index % sequence.length];
};
