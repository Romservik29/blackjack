import './App.css';
import {createRoom} from './blackjack';
import {useStore} from './store';
import {observer} from 'mobx-react-lite';
import MiddleBar from './components/Bars/MiddleBar';
import BottomBar from './components/Bars/BottomBar';
import PlayerPlaces from './components/PlayerPlaces';
import styled from 'styled-components';
import DealerScore from './components/DealerScore';
import PlaceBetItems from './components/PlaceBetItems';
import {useCallback, useLayoutEffect, useRef} from 'react';

const Container = styled.div`
position: relative;
display: flex;
justify-content: center;
`;

export default observer((): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const gameStore = useStore('Game');

  const updateCanvas = useCallback(() => {
    if (canvasRef.current) {
      const currentRatio = window.innerWidth / window.innerHeight;
      const width = currentRatio > 16 / 9 ?
        window.innerHeight * 16 / 9 :
        window.innerWidth;
      const height = currentRatio > 16 / 9 ?
        window.innerHeight :
        window.innerWidth * 9 / 16;
      canvasRef.current.height = height;
      canvasRef.current.style.height = height + 'px';
      canvasRef.current.width = width;
      canvasRef.current.style.width = width + 'px';
      if (divRef.current) {
        divRef.current.style.height = height + 'px';
        divRef.current.style.width = width + 'px';
        divRef.current.style.fontSize = width / 1340.4 + 'em';
      }
    }
  }, []);

  useLayoutEffect(() => {
    if (canvasRef.current && divRef.current) {
      updateCanvas();
      createRoom(canvasRef.current, gameStore);
    }
    window.addEventListener('resize', updateCanvas);
    return () => window.removeEventListener('resize', updateCanvas);
  }, [updateCanvas, gameStore]);

  return (
    <div>
      <Container>
        <canvas ref={canvasRef}style={{position: 'absolute', zIndex: 1}}></canvas>
        <div id="canvas_2d" ref={divRef} style={{position: 'absolute'}}>
          <MiddleBar />
          <BottomBar />
          <DealerScore />
          <PlayerPlaces />
          <PlaceBetItems />
        </div>
      </Container>
    </div>
  );
},
);
