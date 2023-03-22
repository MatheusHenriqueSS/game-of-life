import React, { FC, useCallback, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

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




const App: FC = () => {
  const [grid, setGrid] = useState(() => {return randomTiles()});
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback((grid: number[][]) => {
    if(!runningRef.current) {
      return;
    }
    //copy grid
    let gridCopy = grid.map((row) => row.slice());
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
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

    setGrid(gridCopy);
  }, [])

  return (
    <div className="App">
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
          setInterval(() => {
            runSimulation(grid);
          })
        }}
      >
        {running ? "Stop": "Start"}
      </button>
    </div>
  );
}

export default App;
