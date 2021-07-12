import { useLayoutEffect, useRef} from "react";
import "./App.css";
import {createRoom} from "./blackjack"
import BlackJack from './components/BlackJack'

export default function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useLayoutEffect(() => {
    if (canvasRef.current) {
      createRoom(canvasRef.current)
    }
  }, []);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef}></canvas>
      {/* <BlackJack /> */}
    </div>
  );
}
