(function() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let lastX = 0, lastY = 0;
    const codes = ['var', 'let', 'const', '{ }', '</>', '0', '1', 'if', 'for', '=>', ';'];

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
            this.text = codes[Math.floor(Math.random() * codes.length)];
            this.size = Math.random() * 10 + 10;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * -3 - 1;
            this.life = 1;
            this.color = `rgba(0, 255, ${Math.random()*100},`;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= 0.02;
        }
        draw() {
            ctx.font = `bold ${this.size}px monospace`;
            ctx.fillStyle = this.color + this.life + ')';
            ctx.fillText(this.text, this.x, this.y);
        }
    }

    function spawn(x, y, count) {
        for(let i=0; i<count; i++) particles.push(new Particle(x, y));
    }

    window.addEventListener('pointerdown', e => spawn(e.clientX, e.clientY, 8));
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