(function() {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    canvas.style.filter = 'blur(60px)';
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
        t += 0.005;
        var gradient1 = ctx.createRadialGradient(
            width * 0.2 + Math.cos(t) * 100, height * 0.2 + Math.sin(t) * 100, 0,
            width * 0.2 + Math.cos(t) * 100, height * 0.2 + Math.sin(t) * 100, width * 0.6
        );
        gradient1.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
        gradient1.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, width, height);
        var gradient2 = ctx.createRadialGradient(
            width * 0.8 - Math.sin(t * 0.8) * 100, height * 0.8 - Math.cos(t * 0.8) * 100, 0,
            width * 0.8 - Math.sin(t * 0.8) * 100, height * 0.8 - Math.cos(t * 0.8) * 100, width * 0.6
        );
        gradient2.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
        gradient2.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient2;
        ctx.fillRect(0, 0, width, height);
        requestAnimationFrame(draw);
    }
    draw();
})();