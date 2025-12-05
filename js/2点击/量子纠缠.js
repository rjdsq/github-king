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
            this.vx = (Math.random() - 0.5) * 6;
            this.vy = (Math.random() - 0.5) * 6;
            this.life = 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= 0.03;
        }
        draw() {
            ctx.fillStyle = `rgba(0, 200, 255, ${this.life})`;
            ctx.fillRect(this.x, this.y, 2, 2);
        }
    }

    function spawn(x, y, count) {
        for(let i=0; i<count; i++) particles.push(new Particle(x, y));
    }

    window.addEventListener('pointerdown', e => spawn(e.clientX, e.clientY, 10));
    window.addEventListener('pointermove', e => {
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if(dist > 25) {
            spawn(e.clientX, e.clientY, 2);
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    function loop() {
        ctx.clearRect(0, 0, width, height);
        for(let i=0; i<particles.length; i++) {
            let p1 = particles[i];
            p1.update();
            p1.draw();
            for(let j=i+1; j<particles.length; j++) {
                let p2 = particles[j];
                let d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if(d < 60) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 200, 255, ${Math.min(p1.life, p2.life) * 0.5})`;
                    ctx.stroke();
                }
            }
            if(p1.life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(loop);
    }
    loop();
})();