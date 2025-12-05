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
        constructor(x, y, isText) {
            this.x = x;
            this.y = y;
            this.isText = isText;
            this.scale = 1;
            this.life = 1;
            this.text = 'Click!';
        }
        update() {
            this.scale += 0.1;
            this.life -= 0.05;
        }
        draw() {
            ctx.globalAlpha = this.life;
            if(this.isText) {
                ctx.font = `bold ${12 * this.scale}px sans-serif`;
                ctx.fillStyle = '#fff';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.strokeText(this.text, this.x - 20*this.scale, this.y);
                ctx.fillText(this.text, this.x - 20*this.scale, this.y);
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 5 * this.scale, 0, Math.PI*2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }

    function spawn(x, y, isText) {
        particles.push(new Particle(x, y, isText));
    }

    window.addEventListener('pointerdown', e => spawn(e.clientX, e.clientY, true));
    window.addEventListener('pointermove', e => {
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if(dist > 30) {
            spawn(e.clientX, e.clientY, false);
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