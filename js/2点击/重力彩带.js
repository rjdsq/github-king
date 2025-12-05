(function() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let lastX = 0, lastY = 0;
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];

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
            this.w = Math.random() * 8 + 4;
            this.h = Math.random() * 4 + 2;
            this.vx = Math.random() * 4 - 2;
            this.vy = Math.random() * -5 - 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 10 - 5;
            this.gravity = 0.2;
            this.life = 1;
        }
        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.angle += this.spin;
            this.life -= 0.01;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life;
            ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
            ctx.restore();
        }
    }

    function spawn(x, y, count) {
        for(let i=0; i<count; i++) particles.push(new Particle(x, y));
    }

    window.addEventListener('pointerdown', e => spawn(e.clientX, e.clientY, 15));
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