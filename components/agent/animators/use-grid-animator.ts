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

    switch (type) {
      case "thinking":
        newSequence = generateThinkingSequence(rows, columns);
        break;
      case "connecting":
        newSequence = generateConnectingSequence(
          rows,
          columns,
          animationOptions?.connectingRing ?? 1,
        );
        break;
      case "listening":
        newSequence = generateListeningSequence(rows, columns);
        break;
      default:
        newSequence = [];
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
  }, [interval, columns, rows, state, type, sequence.length]);

  return sequence[index % sequence.length];
};
