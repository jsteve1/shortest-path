interface KeyboardOptions {
  onKeyDown: (event: KeyboardEvent) => void;
}

export function keyboard(node: HTMLElement, options: KeyboardOptions) {
  function handleKeyDown(event: KeyboardEvent) {
    options.onKeyDown(event);
  }

  node.addEventListener('keydown', handleKeyDown);

  return {
    destroy() {
      node.removeEventListener('keydown', handleKeyDown);
    },
    update(newOptions: KeyboardOptions) {
      options = newOptions;
    }
  };
} 