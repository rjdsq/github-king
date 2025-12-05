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
            this.size = Math.random() * 15 + 12;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 2 + 1;
            this.rotation = Math.random() * 360;
            this.rotSpeed = Math.random() * 4 - 2;
            this.life = 1;
            this.symbol = Math.random() > 0.5 ? '🍁' : '🍂';
        }
        update() {
            this.x += this.speedX + 0.5; 
            this.y += this.speedY;
            this.rotation += this.rotSpeed;
            this.life -= 0.01;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.life;
            ctx.font = `${this.size}px serif`;
            ctx.fillText(this.symbol, -this.size/2, -this.size/2);
            ctx.restore();
        }
    }

    function spawn(x, y, count) {
        for(let i=0; i<count; i++) particles.push(new Particle(x, y));
    }

    window.addEventListener('pointerdown', e => spawn(e.clientX, e.clientY, 10));
    window.addEventListener('pointermove', e => {
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if(dist > 35) {
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