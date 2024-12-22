interface GridInteractionOptions {
  onCellClick: (row: number, col: number) => void;
  onCellDrag: (row: number, col: number) => void;
  onMouseUp: () => void;
  isRunning: boolean;
}

export function gridInteraction(node: HTMLElement, options: GridInteractionOptions) {
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
      options.onCellDrag(row, col);
    }
  }

  function handleMouseUp() {
    if (isMouseDown) {
      isMouseDown = false;
      options.onMouseUp();
    }
  }

  // Add event listeners
  node.addEventListener('mousedown', handleMouseDown);
  node.addEventListener('mouseover', handleMouseEnter);
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('mouseleave', handleMouseUp);

  return {
    destroy() {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('mouseover', handleMouseEnter);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    },
    update(newOptions: GridInteractionOptions) {
      options = newOptions;
    }
  };
} 