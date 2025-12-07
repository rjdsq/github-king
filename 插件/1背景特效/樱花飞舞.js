(function() {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var width, height;
    var petals = [];
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    for(var i = 0; i < 30; i++) {
        petals.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 5 + 5,
            speed: Math.random() * 1 + 0.5,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.05
        });
    }
    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255, 192, 203, 0.6)';
        for(var i = 0; i < petals.length; i++) {
            var p = petals[i];
            p.y += p.speed;
            p.x += Math.sin(p.angle) * 0.5;
            p.angle += p.spin;
            if(p.y > height) {
                p.y = -10;
                p.x = Math.random() * width;
            }
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        requestAnimationFrame(draw);
    }
    draw();
})();