interface GridOptions {
  onCellClick: (row: number, col: number) => void;
  onCellEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  isRunning: boolean;
}

export function grid(node: HTMLElement, options: GridOptions) {
  let isMouseDown = false;

  function handleMouseDown(event: MouseEvent) {
    if (options.isRunning) return;
    
    const target = event.target as HTMLElement;
    const row = parseInt(target.dataset.row || '');
    const col = parseInt(target.dataset.col || '');
    
    if (!isNaN(row) && !isNaN(col)) {
      isMouseDown = true;
      options.onCellClick(row, col);
    }
  }

  function handleMouseEnter(event: MouseEvent) {
    if (!isMouseDown || options.isRunning) return;
    
    const target = event.target as HTMLElement;
    const row = parseInt(target.dataset.row || '');
    const col = parseInt(target.dataset.col || '');
    
    if (!isNaN(row) && !isNaN(col)) {
      options.onCellEnter(row, col);
    }
  }

  function handleMouseUp() {
    isMouseDown = false;
    options.onMouseUp();
  }

  function handleMouseLeave() {
    isMouseDown = false;
    options.onMouseLeave();
  }

  node.addEventListener('mousedown', handleMouseDown);
  node.addEventListener('mouseenter', handleMouseEnter, true);
  node.addEventListener('mouseup', handleMouseUp);
  node.addEventListener('mouseleave', handleMouseLeave);

  return {
    destroy() {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('mouseenter', handleMouseEnter, true);
      node.removeEventListener('mouseup', handleMouseUp);
      node.removeEventListener('mouseleave', handleMouseLeave);
    },
    update(newOptions: GridOptions) {
      options = newOptions;
    }
  };
} 