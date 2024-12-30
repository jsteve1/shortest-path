<script lang="ts">
  import { pathfindingStore } from '../stores/pathfindingStore';
  import { onMount } from 'svelte';

  let gridSize = { rows: 20, cols: 40 };
  let speed = 50;
  let maxCols: number;
  let maxRows: number;

  onMount(() => {
    updateMaxGridSize();
    window.addEventListener('resize', updateMaxGridSize);
    return () => {
      window.removeEventListener('resize', updateMaxGridSize);
    };
  });

  function updateMaxGridSize() {
    const container = document.querySelector('.controls-container');
    const containerWidth = container ? container.clientWidth - 32 : Math.min(window.innerWidth - 64, 1168);
    const containerHeight = window.innerHeight - 400;
    const minCellSize = 20;
    
    maxCols = Math.floor(containerWidth / minCellSize);
    maxRows = Math.floor(containerHeight / minCellSize);

    const newCols = Math.min(Math.max(5, gridSize.cols), maxCols);
    const newRows = Math.min(Math.max(5, gridSize.rows), maxRows);
    
    if (newCols !== gridSize.cols || newRows !== gridSize.rows) {
      gridSize = { rows: newRows, cols: newCols };
      updateGridSize();
    }
  }

  function updateGridSize() {
    if (!$pathfindingStore.isRunning) {
      const newRows = Math.min(Math.max(5, gridSize.rows), maxRows);
      const newCols = Math.min(Math.max(5, gridSize.cols), maxCols);
      
      if (newRows !== $pathfindingStore.gridSize.rows || newCols !== $pathfindingStore.gridSize.cols) {
        gridSize = { rows: newRows, cols: newCols };
        pathfindingStore.initializeGrid(newRows, newCols);
        
        const container = document.querySelector('.controls-container');
        const containerWidth = container ? container.clientWidth - 32 : Math.min(window.innerWidth - 64, 1168);
        const containerHeight = window.innerHeight - 400;
        
        const cellWidth = Math.floor((containerWidth - 2) / newCols);
        const cellHeight = Math.floor((containerHeight - 2) / newRows);
        const cellSize = Math.min(cellWidth, cellHeight);
        
        document.documentElement.style.setProperty('--grid-cell-size', `${cellSize}px`);
      }
    }
  }

  function updateSpeed() {
    if (!$pathfindingStore.isRunning) {
      pathfindingStore.setAnimationSpeed(speed);
    }
  }
</script>

<div class="controls-container w-full flex flex-wrap gap-4 items-center">
  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="algorithm">
      Algorithm
    </label>
    <select
      id="algorithm"
      class="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      bind:value={$pathfindingStore.algorithm}
      disabled={$pathfindingStore.isRunning}
    >
      <option value="astar">A* Search</option>
      <option value="dijkstra">Dijkstra's Algorithm</option>
      <option value="bfs">Breadth-First Search</option>
    </select>
  </div>

  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="grid-rows">
      Grid Size
    </label>
    <div class="flex gap-2" role="group" aria-label="Grid size controls">
      <input
        id="grid-rows"
        type="number"
        class="w-20 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        bind:value={gridSize.rows}
        min="5"
        max={maxRows}
        on:change={updateGridSize}
        disabled={$pathfindingStore.isRunning}
        aria-label="Number of rows"
      />
      <span class="text-gray-700 dark:text-gray-300" aria-hidden="true">×</span>
      <input
        id="grid-cols"
        type="number"
        class="w-20 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        bind:value={gridSize.cols}
        min="5"
        max={maxCols}
        on:change={updateGridSize}
        disabled={$pathfindingStore.isRunning}
        aria-label="Number of columns"
      />
    </div>
    <span class="text-xs text-gray-500 dark:text-gray-400">
      Max size: {maxRows} × {maxCols}
    </span>
  </div>

  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="speed">
      Animation Speed (ms)
    </label>
    <input
      id="speed"
      type="range"
      class="w-40"
      bind:value={speed}
      min="1"
      max="200"
      step="1"
      on:change={updateSpeed}
      disabled={$pathfindingStore.isRunning}
      aria-valuemin="1"
      aria-valuemax="200"
      aria-valuenow={speed}
    />
    <span class="text-sm text-gray-600 dark:text-gray-400 text-center" aria-live="polite">{speed}ms</span>
  </div>
</div>