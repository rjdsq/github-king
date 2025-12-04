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
    var t = 0;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    function draw() {
        ctx.clearRect(0, 0, width, height);
        t += 0.02;
        ctx.lineWidth = 1;
        for(var i = 0; i < 3; i++) {
            ctx.beginPath();
            var offset = i * 150;
            ctx.strokeStyle = 'rgba(99, 102, 241, ' + (0.1 - i * 0.02) + ')';
            for(var x = 0; x < width; x+=5) {
                var y = height / 2 + Math.sin(x * 0.01 + t + i) * 50 * Math.sin(t * 0.5);
                if(x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        requestAnimationFrame(draw);
    }
    draw();
})();