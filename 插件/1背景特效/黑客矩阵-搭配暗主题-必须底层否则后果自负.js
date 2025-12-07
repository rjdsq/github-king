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
    var fontSize = 14;
    var columns;
    var drops = [];
    var str = "0123456789ABCDEF";
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.ceil(width / fontSize);
        drops = [];
        for(var i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
    }
    window.addEventListener('resize', resize);
    resize();
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(0, 255, 65, 0.15)';
        ctx.font = fontSize + 'px monospace';
        for(var i = 0; i < drops.length; i++) {
            var text = str[Math.floor(Math.random() * str.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if(drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(draw);
    }
    draw();
})();