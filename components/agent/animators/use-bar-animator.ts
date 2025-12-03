import { AgentState } from "@/components/agent/data/agent";
import { useEffect, useRef, useState } from "react";
import {
  GridAnimationOptions,
  GridAnimatorState,
} from "@/components/agent/agent-control-bar";
import { generateConnectingSequenceBar } from "@/components/agent/animation-sequences/connecting-sequence";
import { generateListeningSequenceBar } from "@/components/agent/animation-sequences/listening-sequence";
import { generateThinkingSequenceBar } from "@/components/agent/animation-sequences/thinking-sequence";

/**
 * Custom hook to animate bar sequences based on agent state.
 */
export const useBarAnimator = (
  type: AgentState,
  columns: number,
  interval: number,
  state: GridAnimatorState,
  animationOptions?: GridAnimationOptions,
): number | number[] => {
  const [index, setIndex] = useState(0);
  const [sequence, setSequence] = useState<number[] | number[][]>([]);

  // Update sequence whenever type or columns change
  useEffect(() => {
    let newSequence: number[] | number[][] = [];

    switch (type) {
      case "thinking":
        newSequence = generateThinkingSequenceBar(columns);
        break;
      case "connecting":
        newSequence = generateConnectingSequenceBar(columns);
        break;
      case "listening":
        newSequence = generateListeningSequenceBar(columns);
        break;
      default:
        newSequence = [];
    }

    setSequence(newSequence);
    setIndex(0);
  }, [type, columns]);

  const animationFrameId = useRef<number | null>(null);

  // Animate sequence
  useEffect(() => {
    if (state === "paused" || sequence.length === 0) return;

    let startTime = performance.now();

    const animate = (time: DOMHighResTimeStamp) => {
      const timeElapsed = time - startTime;

      if (timeElapsed >= interval) {
        setIndex((prev) => (sequence.length > 0 ? (prev + 1) % sequence.length : 0));
        startTime = time;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [interval, state, sequence]);

  return sequence[index % sequence.length];
};
