(function() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let lastX = 0, lastY = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 1;
            this.maxRadius = Math.random() * 30 + 20;
            this.life = 1;
            this.hue = Math.random() * 60 + 160; 
        }
        update() {
            this.radius += (this.maxRadius - this.radius) * 0.1;
            this.life -= 0.02;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.life * 0.5})`;
            ctx.shadowBlur = 20;
            ctx.shadowColor = `hsla(${this.hue}, 80%, 60%, 1)`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function spawn(x, y) {
        particles.push(new Particle(x, y));
    }

    window.addEventListener('pointerdown', e => spawn(e.clientX, e.clientY));
    window.addEventListener('pointermove', e => {
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if(dist > 40) {
            spawn(e.clientX, e.clientY);
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    function loop() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';
        for(let i=particles.length-1; i>=0; i--) {
            particles[i].update();
            particles[i].draw();
            if(particles[i].life <= 0) particles.splice(i, 1);
        }
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(loop);
    }
    loop();
})();