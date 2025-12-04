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
    var circles = [];
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    for(var i = 0; i < 15; i++) {
        circles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 50 + 20,
            dx: (Math.random() - 0.5) * 0.2,
            dy: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.1 + 0.05,
            opacitySpeed: (Math.random() - 0.5) * 0.002
        });
    }
    function draw() {
        ctx.clearRect(0, 0, width, height);
        for(var i = 0; i < circles.length; i++) {
            var c = circles[i];
            c.x += c.dx;
            c.y += c.dy;
            c.opacity += c.opacitySpeed;
            if(c.x < -c.r || c.x > width + c.r) c.dx *= -1;
            if(c.y < -c.r || c.y > height + c.r) c.dy *= -1;
            if(c.opacity <= 0.02 || c.opacity >= 0.15) c.opacitySpeed *= -1;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, ' + c.opacity + ')';
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }
    draw();
})();