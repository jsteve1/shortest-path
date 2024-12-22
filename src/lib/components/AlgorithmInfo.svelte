<script lang="ts">
  import { pathfindingStore } from '../stores/pathfindingStore';

  const algorithmInfo = {
    astar: {
      name: 'A* Search',
      description: 'A* is an informed search algorithm that uses heuristics to find the shortest path efficiently. It combines the benefits of Dijkstra\'s algorithm (favoring vertices close to the starting point) and greedy best-first search (favoring vertices close to the goal).',
      complexity: 'O(|E| + |V|log|V|)',
      pros: ['Generally faster than Dijkstra\'s', 'Guarantees shortest path', 'Uses heuristics to guide search'],
      cons: ['More complex implementation', 'Memory intensive']
    },
    dijkstra: {
      name: 'Dijkstra\'s Algorithm',
      description: 'Dijkstra\'s algorithm is a graph search algorithm that solves the single-source shortest path problem for a graph with non-negative edge weights. It works by maintaining a set of unvisited nodes and continuously selecting the unvisited node with the smallest tentative distance.',
      complexity: 'O(|E| + |V|log|V|)',
      pros: ['Guarantees shortest path', 'Works well with weighted graphs', 'Simple to understand'],
      cons: ['Slower than A* for pathfinding', 'Explores in all directions']
    },
    bfs: {
      name: 'Breadth-First Search',
      description: 'BFS is an algorithm for traversing or searching tree or graph data structures. It starts at a chosen node and explores all neighbor nodes at the present depth before moving on to nodes at the next depth level.',
      complexity: 'O(|V| + |E|)',
      pros: ['Simple implementation', 'Guarantees shortest path in unweighted graphs', 'Memory efficient'],
      cons: ['Not suitable for weighted graphs', 'Explores in all directions']
    }
  };
</script>

<div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
  <h2 class="text-2xl font-bold mb-4">Algorithm Details</h2>
  
  {#if $pathfindingStore.algorithm}
    {@const info = algorithmInfo[$pathfindingStore.algorithm]}
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">{info.name}</h3>
        <p class="text-gray-600 dark:text-gray-400">{info.description}</p>
      </div>
      
      <div>
        <h4 class="font-medium mb-1">Time Complexity</h4>
        <p class="text-gray-600 dark:text-gray-400 font-mono">{info.complexity}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 class="font-medium mb-1 text-green-600 dark:text-green-400">Advantages</h4>
          <ul class="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
            {#each info.pros as pro}
              <li>{pro}</li>
            {/each}
          </ul>
        </div>
        
        <div>
          <h4 class="font-medium mb-1 text-red-600 dark:text-red-400">Limitations</h4>
          <ul class="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
            {#each info.cons as con}
              <li>{con}</li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  {/if}
</div> 