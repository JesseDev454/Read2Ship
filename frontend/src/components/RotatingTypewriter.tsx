import { useEffect, useState } from "react";

interface RotatingTypewriterProps {
  words: string[];
  className?: string;
}

export function RotatingTypewriter({ words, className = "" }: RotatingTypewriterProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [letterCount, setLetterCount] = useState(words[0]?.length ?? 0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReduceMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reduceMotion || !words.length) return;

    const currentWord = words[wordIndex];
    const isComplete = letterCount === currentWord.length;
    const isEmpty = letterCount === 0;
    const delay = isComplete && !isDeleting ? 1500 : isEmpty && isDeleting ? 260 : isDeleting ? 42 : 78;

    const timeout = window.setTimeout(() => {
      if (isComplete && !isDeleting) {
        setIsDeleting(true);
        return;
      }

      if (isEmpty && isDeleting) {
        setIsDeleting(false);
        setWordIndex((current) => (current + 1) % words.length);
        return;
      }

      setLetterCount((current) => current + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [isDeleting, letterCount, reduceMotion, wordIndex, words]);

  const currentWord = words[wordIndex] ?? "";
  const visibleWord = reduceMotion ? words[0] ?? "" : currentWord.slice(0, letterCount);

  return (
    <span
      className={`typewriter-word ${className}`}
      aria-label={words.join(", ")}
    >
      {visibleWord}
    </span>
  );
}
