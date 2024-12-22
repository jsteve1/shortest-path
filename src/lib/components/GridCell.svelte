<script lang="ts">
  import type { Cell } from '../stores/pathfindingStore';
  import { themeStore } from '../stores/themeStore';

  export let cell: Cell;
  export let row: number;
  export let col: number;
  export let isSelected: boolean = false;
  export let onKeyDown: (event: KeyboardEvent) => void;
  export let onClick: () => void;
  export let onMouseEnter: () => void;

  $: cellClass = `
    grid-cell
    cursor-pointer
    ${cell.type !== 'empty' ? `grid-cell-${cell.type}` : ''}
    ${$themeStore ? 'dark' : ''}
  `;
</script>

<div
  class={cellClass}
  role="gridcell"
  tabindex="0"
  data-row={row}
  data-col={col}
  aria-label="{cell.type} cell at row {row + 1}, column {col + 1}"
  aria-selected={isSelected}
  on:mousedown|preventDefault={onClick}
  on:mouseenter|preventDefault={onMouseEnter}
  on:keydown={onKeyDown}
></div>

<style>
  :global(.grid-cell) {
    width: var(--grid-cell-size);
    height: var(--grid-cell-size);
    @apply border border-gray-200 transition-all duration-200 bg-white;
  }

  :global(.grid-cell.dark) {
    @apply border-gray-700 bg-gray-800;
  }

  :global(.grid-cell-start) {
    @apply bg-green-500;
  }

  :global(.grid-cell-start.dark) {
    @apply bg-green-600;
  }

  :global(.grid-cell-end) {
    @apply bg-red-500;
  }

  :global(.grid-cell-end.dark) {
    @apply bg-red-600;
  }

  :global(.grid-cell-wall) {
    @apply bg-gray-800;
  }

  :global(.grid-cell-wall.dark) {
    @apply bg-gray-600;
  }

  :global(.grid-cell-path) {
    @apply bg-blue-500;
  }

  :global(.grid-cell-path.dark) {
    @apply bg-blue-600;
  }

  :global(.grid-cell-visited) {
    @apply bg-purple-300;
  }

  :global(.grid-cell-visited.dark) {
    @apply bg-purple-800;
  }
</style> 