# Rudra Jha - Interactive Portfolio Website

An immersive, interactive portfolio website featuring a stunning 3D background animation and an engaging space navigation game.

## Features

### 🎨 Interactive 3D Background
- **Spline-inspired** particle system with 2000+ animated particles
- **Geometric shapes** (Torus Knot, Icosahedron, Octahedron) with dynamic lighting
- **Mouse interaction** - background responds to cursor movement
- **Scroll effects** - camera movement based on page scroll
- **Click effects** - particle bursts on canvas interaction

### 🎮 Space Navigator Game
A fully-featured 3D space shooter game with:
- **3D Spaceship** with realistic physics and momentum
- **Obstacle Navigation** - walls with randomized gaps
- **Power-ups System**:
  - 🛡️ **Shield** - Protects from damage
  - ⚡ **Speed Boost** - Increases movement speed
  - 🔫 **Weapon Upgrade** - Multi-level shooting system (up to 3 projectiles)
- **Realistic Physics** - acceleration, friction, and momentum
- **Score System** - points for passing walls and destroying obstacles
- **Progressive Difficulty** - game speed increases over time
- **Particle Effects** - engine trails and explosions

### 🎯 Portfolio Sections
- **Hero Section** - Eye-catching introduction with gradient text
- **About** - Background and interests
- **Skills** - Interactive skill badges with hover effects
- **Projects** - Featured work with 3D tilt cards
- **Game** - Playable space shooter
- **Contact** - Multiple ways to connect

## Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)** - Game logic and interactivity
- **Three.js** - 3D graphics and animations
- **Canvas API** - 2D game rendering

## Getting Started

### View the Website

Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge).

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Rudra-iitg/Rudra-iitg.git
cd Rudra-iitg
```

2. Open with a local server (recommended):
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
```

3. Visit `http://localhost:8000` in your browser

### GitHub Pages Deployment

The website can be deployed using GitHub Pages:
1. Go to repository Settings
2. Navigate to Pages section
3. Select the branch to deploy from
4. Your site will be live at `https://rudra-iitg.github.io/Rudra-iitg/`

## Game Controls

- **↑/W** - Move Up
- **↓/S** - Move Down
- **←/A** - Move Left
- **→/D** - Move Right
- **Space** - Fire (requires weapon upgrade)

## Features Breakdown

### 3D Background Animation
The background uses Three.js to create an immersive 3D environment:
- Particle system with color variation
- Multiple rotating geometric shapes
- Dynamic lighting with point lights
- Smooth camera movement following mouse
- Interactive click effects

### Space Game Physics
The game implements realistic physics:
- Velocity and acceleration
- Friction and momentum
- Collision detection
- Particle systems for visual effects

### Responsive Design
- Mobile-friendly navigation
- Adaptive layout for all screen sizes
- Touch-friendly controls
- Optimized performance for lower-end devices

## Browser Compatibility

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

## Performance

- Optimized particle count for smooth 60fps
- Efficient collision detection
- Reduced animations on low-end devices
- Minimal external dependencies

## Credits

**Developer**: Rudra Jha
**Email**: rudrarajjha2004@gmail.com
**LinkedIn**: [rudra-jha-iitg](https://www.linkedin.com/in/rudra-jha-iitg)
**Website**: [rudrajha.com](https://rudrajha.com)

## License

This project is open source and available for personal and educational use.

---

Made with ❤️ using Three.js and vanilla JavaScript
