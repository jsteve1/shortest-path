import { writable, get } from 'svelte/store';

export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'path' | 'visited';
export type Algorithm = 'dijkstra' | 'astar' | 'bfs';

export interface Cell {
  row: number;
  col: number;
  type: CellType;
  f?: number;
  g?: number;
  h?: number;
  parent?: Cell;
}

interface PathfindingState {
  grid: Cell[][];
  gridSize: { rows: number; cols: number };
  algorithm: Algorithm;
  animationSpeed: number;
  isRunning: boolean;
  startCell: { row: number; col: number } | null;
  endCell: { row: number; col: number } | null;
  shouldStop: boolean;
}

const createPathfindingStore = () => {
  const initialState: PathfindingState = {
    grid: [],
    gridSize: { rows: 20, cols: 40 },
    algorithm: 'astar',
    animationSpeed: 50,
    isRunning: false,
    startCell: null,
    endCell: null,
    shouldStop: false
  };

  const { subscribe, set, update } = writable<PathfindingState>(initialState);

  const initializeGrid = (rows: number, cols: number) => {
    const newGrid: Cell[][] = Array(rows)
      .fill(null)
      .map((_, row) =>
        Array(cols)
          .fill(null)
          .map((_, col) => ({
            row,
            col,
            type: 'empty'
          }))
      );

    update(state => ({
      ...state,
      grid: newGrid,
      gridSize: { rows, cols },
      startCell: null,
      endCell: null
    }));
  };

  const setCell = (row: number, col: number, type: CellType) => {
    update(state => {
      const newGrid = [...state.grid];
      const oldType = newGrid[row][col].type;
      newGrid[row][col] = { ...newGrid[row][col], type };

      // Update start/end cell references
      if (type === 'start') {
        if (state.startCell) {
          newGrid[state.startCell.row][state.startCell.col].type = 'empty';
        }
        state.startCell = { row, col };
      } else if (type === 'end') {
        if (state.endCell) {
          newGrid[state.endCell.row][state.endCell.col].type = 'empty';
        }
        state.endCell = { row, col };
      } else if (oldType === 'start' && type !== 'start') {
        state.startCell = null;
      } else if (oldType === 'end' && type !== 'end') {
        state.endCell = null;
      }

      return { ...state, grid: newGrid };
    });
  };

  const clearPath = () => {
    update(state => {
      const newGrid = state.grid.map(row =>
        row.map(cell => ({
          ...cell,
          type: cell.type === 'path' || cell.type === 'visited' ? 'empty' : cell.type
        }))
      );
      return { ...state, grid: newGrid };
    });
  };

  const resetGrid = () => {
    update(state => {
      initializeGrid(state.gridSize.rows, state.gridSize.cols);
      return state;
    });
  };

  return {
    subscribe,
    setCell,
    clearPath,
    resetGrid,
    initializeGrid,
    getState: () => get({ subscribe }),
    setAlgorithm: (algorithm: Algorithm) =>
      update(state => ({ ...state, algorithm })),
    setAnimationSpeed: (speed: number) =>
      update(state => ({ ...state, animationSpeed: speed })),
    setIsRunning: (isRunning: boolean) =>
      update(state => ({ ...state, isRunning, shouldStop: false })),
    stopAlgorithm: () =>
      update(state => ({ ...state, shouldStop: true })),
    shouldStop: () => get({ subscribe }).shouldStop
  };
};

export const pathfindingStore = createPathfindingStore(); 