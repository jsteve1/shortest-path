<script lang="ts">
  import Grid from '$lib/components/Grid.svelte';
  import Controls from '$lib/components/Controls.svelte';
  import AlgorithmInfo from '$lib/components/AlgorithmInfo.svelte';
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
  <main class="container mx-auto px-4 py-8">
    <div class="flex flex-col gap-8 max-w-[1200px] mx-auto">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-2">Pathfinding Visualizer</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Visualize how different pathfinding algorithms work in real-time
        </p>
      </div>

      <div class="flex flex-col gap-4 w-full">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <Controls />
        </div>
        <Grid />
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <AlgorithmInfo />
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 class="text-2xl font-bold mb-4">How to Use</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold mb-2">Tools</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Click and drag to draw walls</li>
              <li>Place start and end points using the respective tools</li>
              <li>Adjust grid size and animation speed using the controls</li>
              <li>Clear the path or reset the entire grid using the buttons</li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">Keyboard Navigation</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Use arrow keys to navigate the grid</li>
              <li>Press Space or Enter to toggle cell type</li>
              <li>Tab to move between interactive elements</li>
              <li>Escape to clear current selection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
