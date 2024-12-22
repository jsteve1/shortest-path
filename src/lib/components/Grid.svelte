<script lang="ts">
  import { pathfindingStore, type Cell, type CellType } from '../stores/pathfindingStore';
  import { astar, dijkstra, bfs } from '../algorithms/pathfinding';
  import { onMount } from 'svelte';
  import GridCell from './GridCell.svelte';

  let currentTool: CellType = 'wall';
  let gridData: Cell[][] = [];
  let algorithm: 'astar' | 'dijkstra' | 'bfs';
  let animationSpeed: number;
  let isRunning: boolean;
  let selectedCell: { row: number; col: number } | null = null;
  let isMouseDown = false;

  pathfindingStore.subscribe(state => {
    gridData = state.grid;
    algorithm = state.algorithm;
    animationSpeed = state.animationSpeed;
    isRunning = state.isRunning;
  });

  onMount(() => {
    pathfindingStore.initializeGrid(20, 40);
    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('resize', updateGridSize);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  function updateGridSize() {
    const container = document.querySelector('.controls-container');
    const containerWidth = container ? container.clientWidth : Math.min(window.innerWidth - 32, 1200);
    const cellSize = Math.floor((containerWidth - 2) / $pathfindingStore.gridSize.cols); // -2 for border
    document.documentElement.style.setProperty('--grid-cell-size', `${cellSize}px`);
  }

  function handleCellClick(row: number, col: number) {
    if (isRunning) return;
    isMouseDown = true;
    pathfindingStore.setCell(row, col, currentTool);
  }

  function handleMouseEnter(row: number, col: number) {
    if (!isMouseDown || isRunning) return;
    if (currentTool === 'wall') {
      pathfindingStore.setCell(row, col, currentTool);
    }
  }

  function handleMouseUp() {
    isMouseDown = false;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (isRunning || !selectedCell) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCellClick(selectedCell.row, selectedCell.col);
    } else if (event.key.startsWith('Arrow')) {
      event.preventDefault();
      let newRow = selectedCell.row;
      let newCol = selectedCell.col;

      switch (event.key) {
        case 'ArrowUp':
          newRow = Math.max(0, newRow - 1);
          break;
        case 'ArrowDown':
          newRow = Math.min(gridData.length - 1, newRow + 1);
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, newCol - 1);
          break;
        case 'ArrowRight':
          newCol = Math.min(gridData[0].length - 1, newCol + 1);
          break;
      }

      selectedCell = { row: newRow, col: newCol };
      const cell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`) as HTMLElement;
      if (cell) cell.focus();
    }
  }

  async function runPathfinding() {
    const state = $pathfindingStore;
    if (!state.startCell || !state.endCell || isRunning) return;

    pathfindingStore.setIsRunning(true);
    pathfindingStore.clearPath();

    const start = gridData[state.startCell.row][state.startCell.col];
    const end = gridData[state.endCell.row][state.endCell.col];

    const onVisit = (cell: Cell) => {
      if (cell !== start && cell !== end) {
        pathfindingStore.setCell(cell.row, cell.col, 'visited');
      }
    };

    let result;
    try {
      switch (algorithm) {
        case 'astar':
          result = await astar(gridData, start, end, animationSpeed, onVisit);
          break;
        case 'dijkstra':
          result = await dijkstra(gridData, start, end, animationSpeed, onVisit);
          break;
        case 'bfs':
          result = await bfs(gridData, start, end, animationSpeed, onVisit);
          break;
      }

      if (result && result.path.length > 0 && !pathfindingStore.shouldStop()) {
        for (const cell of result.path) {
          if (pathfindingStore.shouldStop()) break;
          if (cell !== start && cell !== end) {
            pathfindingStore.setCell(cell.row, cell.col, 'path');
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
          }
        }
      }
    } catch (error) {
      // Handle any errors during algorithm execution
    } finally {
      pathfindingStore.setIsRunning(false);
    }
  }
</script>

<style>
  .grid-wrapper {
    @apply w-full flex justify-center items-center;
  }

  .grid-container {
    @apply w-full max-w-[1200px] mx-auto;
    width: calc(var(--grid-cell-size) * var(--grid-cols));
  }

  :global(.grid-cell) {
    width: var(--grid-cell-size);
    height: var(--grid-cell-size);
    @apply border border-gray-200 transition-all duration-200;
    background-color: white;
  }

  :global(.dark .grid-cell) {
    @apply border-gray-700 bg-gray-800;
  }

  :global(.grid-cell-start) {
    @apply bg-green-500 !important;
  }

  :global(.dark .grid-cell-start) {
    @apply bg-green-600 !important;
  }

  :global(.grid-cell-end) {
    @apply bg-red-500 !important;
  }

  :global(.dark .grid-cell-end) {
    @apply bg-red-600 !important;
  }

  :global(.grid-cell-wall) {
    @apply bg-gray-800 !important;
  }

  :global(.dark .grid-cell-wall) {
    @apply bg-gray-600 !important;
  }

  :global(.grid-cell-path) {
    @apply bg-blue-500 !important;
  }

  :global(.dark .grid-cell-path) {
    @apply bg-blue-600 !important;
  }

  :global(.grid-cell-visited) {
    @apply bg-purple-300 !important;
  }

  :global(.dark .grid-cell-visited) {
    @apply bg-purple-800 !important;
  }
</style>

<div class="flex flex-col gap-4 w-full max-w-[1200px] mx-auto">
  <div class="controls-container flex flex-wrap gap-4 items-center">
    <div class="flex gap-2">
      <button
        class="px-3 py-1 rounded-md {currentTool === 'wall' ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}"
        on:click={() => currentTool = 'wall'}
        aria-pressed={currentTool === 'wall'}
      >
        Wall
      </button>
      <button
        class="px-3 py-1 rounded-md {currentTool === 'start' ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}"
        on:click={() => currentTool = 'start'}
        aria-pressed={currentTool === 'start'}
      >
        Start
      </button>
      <button
        class="px-3 py-1 rounded-md {currentTool === 'end' ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}"
        on:click={() => currentTool = 'end'}
        aria-pressed={currentTool === 'end'}
      >
        End
      </button>
    </div>

    <button
      class="px-3 py-1 rounded-md bg-primary-500 text-white disabled:opacity-50"
      on:click={runPathfinding}
      disabled={isRunning || !$pathfindingStore.startCell || !$pathfindingStore.endCell}
    >
      {isRunning ? 'Running...' : 'Start'}
    </button>

    <button
      class="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
      on:click={() => pathfindingStore.clearPath()}
      disabled={isRunning}
    >
      Clear Path
    </button>

    <button
      class="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
      on:click={() => pathfindingStore.resetGrid()}
      disabled={isRunning}
    >
      Reset Grid
    </button>
  </div>

  <div class="grid-wrapper">
    <div class="grid-container">
      <div
        class="grid gap-0 border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-800 rounded-lg"
        style="grid-template-columns: repeat({$pathfindingStore.gridSize.cols}, var(--grid-cell-size)); --grid-cols: {$pathfindingStore.gridSize.cols}"
        role="grid"
        aria-label="Pathfinding Grid"
      >
        {#each gridData as row, i}
          {#each row as cell, j}
            <GridCell
              {cell}
              row={i}
              col={j}
              isSelected={selectedCell?.row === i && selectedCell?.col === j}
              onKeyDown={handleKeyDown}
              onClick={() => handleCellClick(i, j)}
              onMouseEnter={() => handleMouseEnter(i, j)}
            />
          {/each}
        {/each}
      </div>
    </div>
  </div>
</div>