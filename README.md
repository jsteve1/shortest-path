# Pathfinding Visualizer

A modern, responsive web application built with SvelteKit to visualize various pathfinding algorithms. The application features a clean, intuitive interface with dark mode support and keyboard navigation.

## Features

- Multiple pathfinding algorithms:
  - A* Search
  - Dijkstra's Algorithm
  - Breadth-First Search
- Interactive grid:
  - Click and drag to draw walls
  - Place start and end points
  - Adjustable grid size
  - Adjustable animation speed
- Accessibility:
  - Full keyboard navigation
  - ARIA labels and roles
  - Dark mode support
  - Responsive design
- Real-time visualization
- Algorithm information and complexity details

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/shortestpath.git
   cd shortestpath
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Keyboard Navigation

- Arrow keys: Navigate through the grid
- Space/Enter: Toggle cell type (wall, empty)
- Tab: Move between interactive elements
- Escape: Clear current selection

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by various pathfinding visualizers
- Built with SvelteKit and TailwindCSS
- Icons from Heroicons
