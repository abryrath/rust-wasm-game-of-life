import { Universe, Cell } from "../pkg/game_of_life_wasm";
import { memory } from "../pkg/game_of_life_wasm_bg";

const CELL_SIZE = 5;
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const canvas = document.getElementById("game-of-life-canvas");
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

canvas.height = height * (CELL_SIZE + 1) + 1;
canvas.width = width * (CELL_SIZE + 1) + 1;

const ctx = canvas.getContext("2d");


const renderLoop = () => {
  universe.tick();
  drawGrid();
  drawCells();
  requestAnimationFrame(renderLoop);
};



const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // vertical lines
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // horizontal lines
  for (let j = 0; j <= width; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width, j * (CELL_SIZE + 1) * 1);
  }
  ctx.stroke();
};

const getIndex = (row, column) => {
  return row * width + column;
};

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

drawGrid()
drawCells();
requestAnimationFrame(renderLoop);
