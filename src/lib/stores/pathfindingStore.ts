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
    update(state => {
      // Create new grid with specified dimensions
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

      // Copy existing cells if possible
      const minRows = Math.min(rows, state.grid.length);
      const minCols = Math.min(cols, state.grid[0]?.length || 0);
      
      for (let i = 0; i < minRows; i++) {
        for (let j = 0; j < minCols; j++) {
          if (state.grid[i][j].type !== 'path' && state.grid[i][j].type !== 'visited') {
            newGrid[i][j].type = state.grid[i][j].type;
          }
        }
      }

      // Update start/end cell references if they're out of bounds
      let startCell = state.startCell;
      let endCell = state.endCell;

      if (startCell && (startCell.row >= rows || startCell.col >= cols)) {
        startCell = null;
      }
      if (endCell && (endCell.row >= rows || endCell.col >= cols)) {
        endCell = null;
      }

      return {
        ...state,
        grid: newGrid,
        gridSize: { rows, cols },
        startCell,
        endCell
      };
    });
  };

  const setCell = (row: number, col: number, type: CellType) => {
    update(state => {
      const newGrid = [...state.grid];
      const oldType = newGrid[row][col].type;
      newGrid[row][col] = { ...newGrid[row][col], type };

      let newState = { ...state, grid: newGrid };

      // Update start/end cell references
      if (type === 'start') {
        if (state.startCell) {
          newGrid[state.startCell.row][state.startCell.col].type = 'empty';
        }
        newState.startCell = { row, col };
      } else if (type === 'end') {
        if (state.endCell) {
          newGrid[state.endCell.row][state.endCell.col].type = 'empty';
        }
        newState.endCell = { row, col };
      } else if (oldType === 'start') {
        newState.startCell = null;
      } else if (oldType === 'end') {
        newState.endCell = null;
      }

      return newState;
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
      const newGrid: Cell[][] = Array(state.gridSize.rows)
        .fill(null)
        .map((_, row) =>
          Array(state.gridSize.cols)
            .fill(null)
            .map((_, col) => ({
              row,
              col,
              type: 'empty' as CellType
            }))
        );
      return {
        ...state,
        grid: newGrid,
        startCell: null,
        endCell: null,
        shouldStop: false
      };
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