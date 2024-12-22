import type { Cell } from '../stores/pathfindingStore';

export interface PathfindingResult {
  path: Cell[];
  visitedNodes: Cell[];
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getNeighbors = (grid: Cell[][], cell: Cell): Cell[] => {
  const neighbors: Cell[] = [];
  const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1] // right
  ];

  for (const [dx, dy] of directions) {
    const newRow = cell.row + dx;
    const newCol = cell.col + dy;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length &&
      grid[newRow][newCol].type !== 'wall'
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }

  return neighbors;
};

const manhattan = (a: Cell, b: Cell): number => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

const reconstructPath = (endCell: Cell): Cell[] => {
  const path: Cell[] = [];
  let current: Cell | undefined = endCell;

  while (current) {
    path.unshift(current);
    current = current.parent;
  }

  return path;
};

export const astar = async (
  grid: Cell[][],
  start: Cell,
  end: Cell,
  animationSpeed: number,
  onVisit: (cell: Cell) => void
): Promise<PathfindingResult> => {
  const openSet: Cell[] = [start];
  const closedSet: Set<string> = new Set();
  const visitedNodes: Cell[] = [];

  start.g = 0;
  start.f = manhattan(start, end);

  while (openSet.length > 0) {
    openSet.sort((a, b) => (a.f || 0) - (b.f || 0));
    const current = openSet.shift()!;
    
    if (current.row === end.row && current.col === end.col) {
      return {
        path: reconstructPath(current),
        visitedNodes
      };
    }

    closedSet.add(`${current.row},${current.col}`);
    visitedNodes.push(current);

    if (current !== start) {
      onVisit(current);
      await sleep(animationSpeed);
    }

    for (const neighbor of getNeighbors(grid, current)) {
      if (closedSet.has(`${neighbor.row},${neighbor.col}`)) continue;

      const tentativeG = (current.g || 0) + 1;

      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= (neighbor.g || 0)) {
        continue;
      }

      neighbor.parent = current;
      neighbor.g = tentativeG;
      neighbor.f = neighbor.g + manhattan(neighbor, end);
    }
  }

  return { path: [], visitedNodes };
};

export const dijkstra = async (
  grid: Cell[][],
  start: Cell,
  end: Cell,
  animationSpeed: number,
  onVisit: (cell: Cell) => void
): Promise<PathfindingResult> => {
  const distances = new Map<string, number>();
  const unvisited = new Set<string>();
  const visitedNodes: Cell[] = [];

  grid.forEach(row => {
    row.forEach(cell => {
      distances.set(`${cell.row},${cell.col}`, Infinity);
      unvisited.add(`${cell.row},${cell.col}`);
    });
  });

  distances.set(`${start.row},${start.col}`, 0);

  while (unvisited.size > 0) {
    let minDistance = Infinity;
    let current: Cell | null = null;

    grid.forEach(row => {
      row.forEach(cell => {
        const key = `${cell.row},${cell.col}`;
        if (unvisited.has(key)) {
          const distance = distances.get(key)!;
          if (distance < minDistance) {
            minDistance = distance;
            current = cell;
          }
        }
      });
    });

    if (!current || minDistance === Infinity) break;
    if (current.row === end.row && current.col === end.col) {
      return {
        path: reconstructPath(current),
        visitedNodes
      };
    }

    const currentKey = `${current.row},${current.col}`;
    unvisited.delete(currentKey);
    visitedNodes.push(current);

    if (current !== start) {
      onVisit(current);
      await sleep(animationSpeed);
    }

    for (const neighbor of getNeighbors(grid, current)) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      if (!unvisited.has(neighborKey)) continue;

      const newDistance = distances.get(currentKey)! + 1;
      if (newDistance < distances.get(neighborKey)!) {
        distances.set(neighborKey, newDistance);
        neighbor.parent = current;
      }
    }
  }

  return { path: [], visitedNodes };
};

export const bfs = async (
  grid: Cell[][],
  start: Cell,
  end: Cell,
  animationSpeed: number,
  onVisit: (cell: Cell) => void
): Promise<PathfindingResult> => {
  const queue: Cell[] = [start];
  const visited = new Set<string>();
  const visitedNodes: Cell[] = [];

  visited.add(`${start.row},${start.col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.row === end.row && current.col === end.col) {
      return {
        path: reconstructPath(current),
        visitedNodes
      };
    }

    visitedNodes.push(current);

    if (current !== start) {
      onVisit(current);
      await sleep(animationSpeed);
    }

    for (const neighbor of getNeighbors(grid, current)) {
      const key = `${neighbor.row},${neighbor.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        neighbor.parent = current;
        queue.push(neighbor);
      }
    }
  }

  return { path: [], visitedNodes };
}; 