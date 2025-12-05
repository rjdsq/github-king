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
            this.startX = x;
            this.size = Math.random() * 15 + 10;
            this.speedY = Math.random() * 2 + 1;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.1 + 0.05;
            this.life = 1;
        }
        update() {
            this.y -= this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x = this.startX + Math.sin(this.wobble) * 10;
            this.life -= 0.01;
        }
        draw() {
            ctx.globalAlpha = this.life;
            ctx.font = `${this.size}px serif`;
            ctx.fillText('🫧', this.x, this.y);
            ctx.globalAlpha = 1;
        }
    }

    function spawn(x, y, count) {
        for(let i=0; i<count; i++) particles.push(new Particle(x, y));
    }

    window.addEventListener('pointerdown', e => spawn(e.clientX, e.clientY, 6));
    window.addEventListener('pointermove', e => {
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if(dist > 40) {
            spawn(e.clientX, e.clientY, 1);
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