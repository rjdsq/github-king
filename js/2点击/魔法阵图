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
            this.rotation = Math.random() * Math.PI * 2;
            this.life = 1;
            this.sides = Math.floor(Math.random() * 3) + 3;
            this.color = `hsl(${Math.random()*60 + 250}, 70%, 60%)`;
        }
        update() {
            this.radius += 2;
            this.rotation += 0.05;
            this.life -= 0.02;
        }
        draw() {
            ctx.beginPath();
            for(let i=0; i<=this.sides; i++) {
                const angle = this.rotation + (i * Math.PI * 2 / this.sides);
                const px = this.x + Math.cos(angle) * this.radius;
                const py = this.y + Math.sin(angle) * this.radius;
                if(i===0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = this.color;
            ctx.globalAlpha = this.life;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }

    function spawn(x, y) {
        particles.push(new Particle(x, y));
    }

    window.addEventListener('pointerdown', e => spawn(e.clientX, e.clientY));
    window.addEventListener('pointermove', e => {
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if(dist > 50) {
            spawn(e.clientX, e.clientY);
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