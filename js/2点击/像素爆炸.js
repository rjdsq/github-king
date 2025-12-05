(function() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let lastX = 0, lastY = 0;
    const colors = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50'];

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
            this.size = Math.random() * 6 + 4;
            this.vx = Math.random() * 8 - 4;
            this.vy = Math.random() * 8 - 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.life = 1;
            this.gravity = 0.4;
        }
        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.life -= 0.02;
        }
        draw() {
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.globalAlpha = 1;
        }
    }

    function spawn(x, y, count) {
        for(let i=0; i<count; i++) particles.push(new Particle(x, y));
    }

    window.addEventListener('pointerdown', e => spawn(e.clientX, e.clientY, 12));
    window.addEventListener('pointermove', e => {
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if(dist > 30) {
            spawn(e.clientX, e.clientY, 2);
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    function loop() {
        ctx.clearRect(0, 0, width, height);
        for(let i=particles.length-1; i>=0; i--) {
            particles[i].update();
            particles[i].draw();
            if(particles[i].life <= 0) particles.splice(i, 1);
        }
        requestAnimationFrame(loop);
    }
    loop();
})();