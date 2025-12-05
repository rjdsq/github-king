(function() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let lastX = 0, lastY = 0;
    const colors = ['#00ffea', '#ff0055', '#ffff00'];

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
            this.w = Math.random() * 20 + 5;
            this.h = Math.random() * 5 + 2;
            this.vx = Math.random() * 10 - 5;
            this.vy = Math.random() * 10 - 5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.life = 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (Math.random() > 0.8) {
                this.x += Math.random() * 20 - 10;
                this.y += Math.random() * 20 - 10;
            }
            this.life -= 0.05;
        }
        draw() {
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.globalAlpha = 1;
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