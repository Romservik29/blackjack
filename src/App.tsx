import { useCallback, useLayoutEffect, useRef } from "react";
import "./App.css";
import { createRoom } from "./blackjack"

export default function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const updateCanvas = useCallback(() => {
    if (canvasRef.current) {
      const currentRatio = window.innerWidth / window.innerHeight;
      const width = currentRatio > 16 / 9
        ? window.innerHeight * 16 / 9
        : window.innerWidth;
      const height = currentRatio > 16 / 9
        ? window.innerHeight
        : window.innerWidth * 9 / 16;
      canvasRef.current.height = height;
      canvasRef.current.style.height = height + "px";
      canvasRef.current.width = width;
      canvasRef.current.style.width = width + "px";
    }
  }, []);
  useLayoutEffect(() => {
    if (canvasRef.current) {
      updateCanvas()
      createRoom(canvasRef.current)
    }
    window.addEventListener("resize", updateCanvas);
    return () => window.removeEventListener("resize", updateCanvas);
  }, [updateCanvas]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef}></canvas>
      {/* <BlackJack /> */}
    </div>
  );
}
