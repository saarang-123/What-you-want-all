class ParticleFirework {
    constructor(options) {
        this.targetElement = document.getElementById(options.elementId);
        this.duration = options.duration || 100; // Default duration is 100 frames
        this.delay = options.delay || 0; // Default delay is 0 (no delay)
        this.totalParticles = options.numParticles || 100; // Default to 100 particles
        this.colors = options.colors || ['#ff00ff']; // Default color is magenta
        this.gravity = 0.05; // Gravity constant
        this.size = options.size || 5; // Default size of particles
        this.shape = options.shape || 'circle'; // Default shape is 'circle'
        this.spread = options.spread || 2; // Default spread, controls velocity
        this.particlesPerFrame = Math.ceil(this.totalParticles / this.duration);
        this.currentParticles = 0;
        this.particles = [];

        if (!this.targetElement) {
            console.error(`Element with ID "${options.elementId}" not found.`);
        } else {
            setTimeout(() => this.animateParticles(), this.delay);
        }
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${this.size}px`;
        particle.style.height = `${this.size}px`;
        particle.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        particle.style.opacity = '1';
        
        // Adjust velocity based on spread
        particle.velX = Math.random() * this.spread * 2 - this.spread; // Horizontal velocity
        particle.velY = Math.random() * this.spread * 2 - this.spread; // Vertical velocity

        // Apply shape-specific styles
        if (this.shape === 'circle') {
            particle.style.borderRadius = '50%';
        } else if (this.shape === 'square') {
            particle.style.borderRadius = '0%';
        } else if (this.shape === 'triangle') {
            particle.style.width = '0';
            particle.style.height = '0';
            particle.style.borderLeft = `${this.size / 2}px solid transparent`;
            particle.style.borderRight = `${this.size / 2}px solid transparent`;
            particle.style.borderBottom = `${this.size}px solid ${particle.style.backgroundColor}`;
            particle.style.backgroundColor = 'transparent';
        }

        document.body.appendChild(particle);
        this.particles.push(particle);
    }

    animateParticles() {
        if (this.currentParticles < this.totalParticles) {
            for (let i = 0; i < this.particlesPerFrame && this.currentParticles < this.totalParticles; i++) {
                const rect = this.targetElement.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                this.createParticle(x, y);
                this.currentParticles++;
            }
        }

        this.particles = this.particles.filter(particle => {
            particle.velY += this.gravity;
            particle.style.left = `${parseFloat(particle.style.left) + particle.velX}px`;
            particle.style.top = `${parseFloat(particle.style.top) + particle.velY}px`;
            particle.style.opacity -= 0.01;

            if (particle.style.opacity <= 0) {
                document.body.removeChild(particle);
                return false;
            }
            return true;
        });

        if (this.particles.length > 0 || this.currentParticles < this.totalParticles) {
            requestAnimationFrame(() => this.animateParticles());
        }
    }
}
