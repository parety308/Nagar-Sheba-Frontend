"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  value: number;
  decimals?: number;
  suffix?: string;
};

export function CountUp({ value, decimals = 0, suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  const fmt = useCallback(
    (n: number) =>
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + suffix,
    [decimals, suffix],
  );

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;

    if (reduce) {
      el.textContent = fmt(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => {
        el.textContent = fmt(v);
      },
    });

    return () => controls.stop();
  }, [inView, value, reduce, fmt]);

  return <span ref={ref}>{fmt(0)}</span>;
}
