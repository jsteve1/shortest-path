interface FocusOptions {
  initialFocus?: boolean;
}

export function focus(node: HTMLElement, options: FocusOptions = {}) {
  if (options.initialFocus) {
    node.focus();
  }

  return {
    update(newOptions: FocusOptions) {
      if (newOptions.initialFocus) {
        node.focus();
      }
    }
  };
} 