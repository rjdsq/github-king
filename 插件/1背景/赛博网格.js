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
    var offset = 0;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    function draw() {
        ctx.clearRect(0, 0, width, height);
        var horizon = height * 0.4;
        var gridHeight = height - horizon;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(var i = -width; i < width * 2; i += 80) {
            ctx.moveTo(i, height);
            ctx.lineTo(width / 2 + (i - width / 2) * 0.1, horizon);
        }
        offset = (offset + 0.5) % 40;
        for(var y = height; y > horizon; y -= 40 * (y / height)) {
            var activeY = y + offset * (y/height);
            if (activeY > height) activeY -= 40;
            if (activeY < horizon) continue;
            ctx.moveTo(0, activeY);
            ctx.lineTo(width, activeY);
        }
        ctx.stroke();
        var grad = ctx.createLinearGradient(0, horizon, 0, height);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.2, 'rgba(56, 189, 248, 0.02)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.1)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, horizon, width, gridHeight);
        requestAnimationFrame(draw);
    }
    draw();
})();