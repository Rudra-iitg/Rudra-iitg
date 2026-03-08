// 3D Space Navigator Game with realistic physics and power-ups
class SpaceGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 500;

        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.health = 100;
        this.shield = 0;

        // Player ship
        this.ship = {
            x: 100,
            y: this.canvas.height / 2,
            width: 40,
            height: 30,
            speed: 5,
            baseSpeed: 5,
            angle: 0,
            vx: 0,
            vy: 0,
            friction: 0.95
        };

        // Power-ups state
        this.powerUps = {
            speed: { active: false, duration: 0 },
            weapon: { level: 1, duration: 0 },
            shield: { active: false, duration: 0 }
        };

        // Game objects
        this.walls = [];
        this.powerUpItems = [];
        this.projectiles = [];
        this.particles = [];

        // Controls
        this.keys = {};
        this.setupControls();

        // Game difficulty
        this.wallSpeed = 3;
        this.wallSpawnTimer = 0;
        this.wallSpawnInterval = 120;

        // UI elements
        this.scoreElement = document.getElementById('score');
        this.healthElement = document.getElementById('health');
        this.shieldElement = document.getElementById('shield');
        this.speedIndicator = document.getElementById('speed-indicator');
        this.weaponIndicator = document.getElementById('weapon-indicator');
        this.gameOverScreen = document.getElementById('game-over');
        this.gameStartScreen = document.getElementById('game-start');
        this.finalScoreElement = document.getElementById('final-score');

        // Buttons
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === ' ' && this.powerUps.weapon.level > 1) {
                e.preventDefault();
                this.shoot();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    start() {
        this.gameStartScreen.classList.add('hidden');
        this.isRunning = true;
        this.gameLoop();
    }

    restart() {
        this.gameOverScreen.classList.add('hidden');
        this.score = 0;
        this.health = 100;
        this.shield = 0;
        this.ship.x = 100;
        this.ship.y = this.canvas.height / 2;
        this.ship.vx = 0;
        this.ship.vy = 0;
        this.walls = [];
        this.powerUpItems = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps.speed.active = false;
        this.powerUps.weapon.level = 1;
        this.powerUps.shield.active = false;
        this.wallSpeed = 3;
        this.isRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isRunning) return;

        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Update ship movement with physics
        this.updateShip();

        // Update walls
        this.updateWalls();

        // Update power-ups
        this.updatePowerUpItems();

        // Update projectiles
        this.updateProjectiles();

        // Update particles
        this.updateParticles();

        // Update power-up durations
        this.updatePowerUpDurations();

        // Spawn new walls
        this.spawnWalls();

        // Update score
        this.score += 1;
        this.scoreElement.textContent = this.score;
        this.healthElement.textContent = Math.max(0, this.health);
        this.shieldElement.textContent = Math.max(0, this.shield);

        // Increase difficulty
        if (this.score % 500 === 0) {
            this.wallSpeed += 0.5;
        }

        // Check game over
        if (this.health <= 0) {
            this.gameOver();
        }
    }

    updateShip() {
        // Apply controls with acceleration
        const accel = 0.5;
        const maxSpeed = this.powerUps.speed.active ? 8 : this.ship.baseSpeed;

        if (this.keys['arrowup'] || this.keys['w']) {
            this.ship.vy -= accel;
        }
        if (this.keys['arrowdown'] || this.keys['s']) {
            this.ship.vy += accel;
        }
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.ship.vx -= accel;
        }
        if (this.keys['arrowright'] || this.keys['d']) {
            this.ship.vx += accel;
        }

        // Apply friction
        this.ship.vx *= this.ship.friction;
        this.ship.vy *= this.ship.friction;

        // Limit speed
        const speed = Math.sqrt(this.ship.vx ** 2 + this.ship.vy ** 2);
        if (speed > maxSpeed) {
            this.ship.vx = (this.ship.vx / speed) * maxSpeed;
            this.ship.vy = (this.ship.vy / speed) * maxSpeed;
        }

        // Update position
        this.ship.x += this.ship.vx;
        this.ship.y += this.ship.vy;

        // Update angle based on velocity
        if (Math.abs(this.ship.vx) > 0.1 || Math.abs(this.ship.vy) > 0.1) {
            this.ship.angle = Math.atan2(this.ship.vy, this.ship.vx);
        }

        // Keep ship in bounds
        this.ship.x = Math.max(this.ship.width / 2, Math.min(this.canvas.width - this.ship.width / 2, this.ship.x));
        this.ship.y = Math.max(this.ship.height / 2, Math.min(this.canvas.height - this.ship.height / 2, this.ship.y));

        // Create engine particles
        if (Math.random() > 0.7) {
            this.particles.push({
                x: this.ship.x - Math.cos(this.ship.angle) * 20,
                y: this.ship.y - Math.sin(this.ship.angle) * 20,
                vx: -Math.cos(this.ship.angle) * 2 - this.ship.vx * 0.5,
                vy: -Math.sin(this.ship.angle) * 2 - this.ship.vy * 0.5,
                life: 20,
                color: this.powerUps.speed.active ? '#00d4ff' : '#7b2ff7'
            });
        }
    }

    spawnWalls() {
        this.wallSpawnTimer++;
        if (this.wallSpawnTimer >= this.wallSpawnInterval) {
            this.wallSpawnTimer = 0;

            const gapSize = 120 + Math.random() * 80;
            const gapPosition = Math.random() * (this.canvas.height - gapSize);

            // Top wall
            this.walls.push({
                x: this.canvas.width,
                y: 0,
                width: 30,
                height: gapPosition,
                passed: false
            });

            // Bottom wall
            this.walls.push({
                x: this.canvas.width,
                y: gapPosition + gapSize,
                width: 30,
                height: this.canvas.height - (gapPosition + gapSize),
                passed: false
            });

            // Spawn power-up occasionally
            if (Math.random() > 0.7) {
                const types = ['shield', 'speed', 'weapon'];
                const type = types[Math.floor(Math.random() * types.length)];
                this.powerUpItems.push({
                    x: this.canvas.width + 50,
                    y: gapPosition + gapSize / 2,
                    width: 30,
                    height: 30,
                    type: type,
                    angle: 0
                });
            }
        }
    }

    updateWalls() {
        for (let i = this.walls.length - 1; i >= 0; i--) {
            const wall = this.walls[i];
            wall.x -= this.wallSpeed;

            // Check collision with ship
            if (!this.powerUps.shield.active && this.checkCollision(this.ship, wall)) {
                this.health -= 10;
                this.createExplosion(this.ship.x, this.ship.y, '#ff006e');
                this.walls.splice(i, 1);
                continue;
            }

            // Check collision with projectiles
            for (let j = this.projectiles.length - 1; j >= 0; j--) {
                const proj = this.projectiles[j];
                if (this.checkCollision(proj, wall)) {
                    this.createExplosion(proj.x, proj.y, '#00d4ff');
                    this.projectiles.splice(j, 1);
                    this.walls.splice(i, 1);
                    this.score += 50;
                    break;
                }
            }

            // Remove off-screen walls
            if (wall.x + wall.width < 0) {
                if (!wall.passed) {
                    this.score += 10;
                    wall.passed = true;
                }
                this.walls.splice(i, 1);
            }
        }
    }

    updatePowerUpItems() {
        for (let i = this.powerUpItems.length - 1; i >= 0; i--) {
            const powerUp = this.powerUpItems[i];
            powerUp.x -= this.wallSpeed;
            powerUp.angle += 0.05;

            // Check collision with ship
            if (this.checkCollision(this.ship, powerUp)) {
                this.activatePowerUp(powerUp.type);
                this.createExplosion(powerUp.x, powerUp.y, '#00ff00');
                this.powerUpItems.splice(i, 1);
                continue;
            }

            // Remove off-screen power-ups
            if (powerUp.x + powerUp.width < 0) {
                this.powerUpItems.splice(i, 1);
            }
        }
    }

    activatePowerUp(type) {
        switch (type) {
            case 'shield':
                this.shield = Math.min(100, this.shield + 50);
                this.powerUps.shield.active = true;
                this.powerUps.shield.duration = 300;
                break;
            case 'speed':
                this.powerUps.speed.active = true;
                this.powerUps.speed.duration = 300;
                this.speedIndicator.textContent = '⚡ Speed: ON';
                this.speedIndicator.style.color = '#00d4ff';
                break;
            case 'weapon':
                this.powerUps.weapon.level = Math.min(3, this.powerUps.weapon.level + 1);
                this.powerUps.weapon.duration = 500;
                this.weaponIndicator.textContent = `🔫 Weapon: Level ${this.powerUps.weapon.level}`;
                this.weaponIndicator.style.color = '#00d4ff';
                break;
        }
    }

    updatePowerUpDurations() {
        // Speed power-up
        if (this.powerUps.speed.active) {
            this.powerUps.speed.duration--;
            if (this.powerUps.speed.duration <= 0) {
                this.powerUps.speed.active = false;
                this.speedIndicator.textContent = '⚡ Speed: OFF';
                this.speedIndicator.style.color = '#b4b4b4';
            }
        }

        // Weapon power-up
        if (this.powerUps.weapon.level > 1) {
            this.powerUps.weapon.duration--;
            if (this.powerUps.weapon.duration <= 0) {
                this.powerUps.weapon.level = 1;
                this.weaponIndicator.textContent = '🔫 Weapon: Level 1';
                this.weaponIndicator.style.color = '#b4b4b4';
            }
        }

        // Shield power-up
        if (this.powerUps.shield.active) {
            this.powerUps.shield.duration--;
            if (this.powerUps.shield.duration <= 0 || this.shield <= 0) {
                this.powerUps.shield.active = false;
            }
        }
    }

    shoot() {
        const projectileSpeed = 10;
        const spread = this.powerUps.weapon.level > 2 ? Math.PI / 12 : 0;

        for (let i = 0; i < this.powerUps.weapon.level; i++) {
            const angle = this.ship.angle + (i - (this.powerUps.weapon.level - 1) / 2) * spread;
            this.projectiles.push({
                x: this.ship.x + Math.cos(this.ship.angle) * 25,
                y: this.ship.y + Math.sin(this.ship.angle) * 25,
                vx: Math.cos(angle) * projectileSpeed,
                vy: Math.sin(angle) * projectileSpeed,
                width: 5,
                height: 5
            });
        }
    }

    updateProjectiles() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.x += proj.vx;
            proj.y += proj.vy;

            if (proj.x < 0 || proj.x > this.canvas.width || proj.y < 0 || proj.y > this.canvas.height) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 30,
                color: color
            });
        }
    }

    draw() {
        // Clear canvas with trail effect
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw stars background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 73) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }

        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.fillRect(particle.x, particle.y, 3, 3);
        });
        this.ctx.globalAlpha = 1;

        // Draw walls
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00d4ff';
        this.walls.forEach(wall => {
            this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            // Add detail lines
            this.ctx.strokeStyle = '#7b2ff7';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
        });

        // Draw power-ups
        this.powerUpItems.forEach(powerUp => {
            this.ctx.save();
            this.ctx.translate(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);
            this.ctx.rotate(powerUp.angle);

            let color;
            switch (powerUp.type) {
                case 'shield': color = '#00ff00'; break;
                case 'speed': color = '#00d4ff'; break;
                case 'weapon': color = '#ff006e'; break;
            }

            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = color;
            this.ctx.fillStyle = color;
            this.ctx.fillRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height);

            this.ctx.restore();
        });

        // Draw projectiles
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00d4ff';
        this.projectiles.forEach(proj => {
            this.ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
        });

        // Draw ship (3D-looking)
        this.ctx.save();
        this.ctx.translate(this.ship.x, this.ship.y);
        this.ctx.rotate(this.ship.angle);

        // Shield effect
        if (this.powerUps.shield.active && this.shield > 0) {
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            this.ctx.lineWidth = 3;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#00ff00';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.ship.width * 0.8, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Ship body (3D effect with gradients)
        const gradient = this.ctx.createLinearGradient(-20, -15, 20, 15);
        gradient.addColorStop(0, '#7b2ff7');
        gradient.addColorStop(0.5, '#00d4ff');
        gradient.addColorStop(1, '#7b2ff7');

        this.ctx.fillStyle = gradient;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00d4ff';

        // Main body
        this.ctx.beginPath();
        this.ctx.moveTo(20, 0);
        this.ctx.lineTo(-15, -12);
        this.ctx.lineTo(-20, -8);
        this.ctx.lineTo(-20, 8);
        this.ctx.lineTo(-15, 12);
        this.ctx.closePath();
        this.ctx.fill();

        // Cockpit
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.beginPath();
        this.ctx.ellipse(5, 0, 8, 5, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Wings detail
        this.ctx.strokeStyle = '#ff006e';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-10, -8);
        this.ctx.lineTo(10, 0);
        this.ctx.lineTo(-10, 8);
        this.ctx.stroke();

        this.ctx.restore();
        this.ctx.shadowBlur = 0;
    }

    gameOver() {
        this.isRunning = false;
        this.finalScoreElement.textContent = this.score;
        this.gameOverScreen.classList.remove('hidden');
    }
}

// Initialize game when DOM is loaded
let game;
if (document.getElementById('game-canvas')) {
    game = new SpaceGame();
}
