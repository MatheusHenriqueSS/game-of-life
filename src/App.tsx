import React, { FC, useCallback, useRef, useState } from 'react';
import './App.css';
import useInterval from './useInterval';
import Slider from '@mui/material/Slider';
const numRows = 25;
const numCols = 35;

const randomTiles = () => {
  const rows: number[][] = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array<number>());
    for (let j = 0; j < numCols; j++) {
      rows[i].push(Math.random() > 0.77 ? 1 : 0);
    }
  }

  return rows;
}

const emptyTiles = () => {
  const rows: number[][] = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array<number>());
    for (let j = 0; j < numCols; j++) {
      rows[i].push(0);
    }
  }
  return rows;
}


const App: FC = () => {
  const [grid, setGrid] = useState(() => {return randomTiles()});
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(250);
  const [slider, setSlider] = useState(50);


  const runningRef = useRef(running);
  runningRef.current = running;

  const handleSpeedChange = (value: any) => {
    setSlider(value);
    setSpeed(5 * (100 - value));
  }
  
  
  const runSimulation = useCallback((grid: number[][], generation: number) => {
    if(!runningRef.current) {
      return;
    }

    //copy grid
    let gridCopy = grid.map((row) => row.slice());
    let alive = 0;
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        alive += gridCopy[i][j];
        //calculate neighbours

        let neighbours= 0;

        for (let dx = -1; dx < 2; dx++) {
          for (let dy = -1; dy < 2; dy++) {
            if(dx === 0 && dy === 0)continue;

            const i1 = i + dx;
            const j1 = j + dy;

            if(Math.min(i1, j1) >= 0 && i1 < numRows && j1 < numCols)neighbours += gridCopy[i1][j1];
            
          }
        }

        if (neighbours < 2 || neighbours > 3) {
          gridCopy[i][j] = 0;
        } else if (gridCopy[i][j] === 0 && neighbours === 3) {
          gridCopy[i][j] = 1;
        }

      }
    }
    if(!alive)setRunning(false);
    setGeneration(generation + 1);
    setGrid(gridCopy);
  }, []);

  useInterval(() => {
    runSimulation(grid, generation);
  }, speed);

  return (
    <div className="App" style={{
      textAlign: "center"
    }}>
      <h1>Game of Life</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, 20px)`,
            width: "fit-content",
            margin: "0 auto"
          }}
        >
          {
            grid.map((rows, i) => rows.map((col, k) => (
              <div
                key={`${i}-${k}`}
                onClick={() => {
                  if(runningRef.current)return;
                  setGeneration(0);
                  // copy array
                  let newGrid = grid.map((row) => row.slice());  
                  //invert tile value
                  newGrid[i][k] ^=1;   
                  setGrid(newGrid);    
                }}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: col ? "#FFC645": undefined,
                  border: "1px solid"
                }}
              />
            ))
            )}
      </div>
      <button
        onClick={() => {
          setRunning(!running);
          runningRef.current = !running;
        }}
      >
        {running ? "Stop": "Start"}
      </button>
      <button
        onClick={() => {
          setGrid(randomTiles())
          setGeneration(0);
          setRunning(false);
        }}
      >
        Random
      </button>
      <button
        onClick={() => {
          setGrid(emptyTiles())
          setRunning(false);
          setGeneration(0);
        }}
      >
        Clear board
      </button>
      <p>Generation: {`${generation}`}</p>
      <div style={{
        width: "12em",
        display: "inline-block",
      }}>
        <p>Speed</p>
        <Slider
        aria-label="Temperature"
        color="primary"
        value={slider}
        onChange={(e: any) => handleSpeedChange(e.target.value)}
      />
      </div>
      
    </div>
  );
}

export default App;
