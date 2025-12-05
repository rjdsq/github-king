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
    var grid = [];
    var cols, rows;
    var size = 100;
    var t = 0;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        cols = Math.ceil(width / size) + 1;
        rows = Math.ceil(height / size) + 1;
    }
    window.addEventListener('resize', resize);
    resize();
    function draw() {
        ctx.clearRect(0, 0, width, height);
        t += 0.005;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.beginPath();
        for(var y = 0; y <= rows; y++) {
            for(var x = 0; x <= cols; x++) {
                var px = x * size;
                var py = y * size;
                var offX = Math.cos(t + x * 0.5 + y * 0.5) * 20;
                var offY = Math.sin(t + x * 0.5 + y * 0.5) * 20;
                if(x < cols) {
                    var nextOffX = Math.cos(t + (x+1) * 0.5 + y * 0.5) * 20;
                    var nextOffY = Math.sin(t + (x+1) * 0.5 + y * 0.5) * 20;
                    ctx.moveTo(px + offX, py + offY);
                    ctx.lineTo((x+1)*size + nextOffX, py + nextOffY);
                }
                if(y < rows) {
                    var nextOffX = Math.cos(t + x * 0.5 + (y+1) * 0.5) * 20;
                    var nextOffY = Math.sin(t + x * 0.5 + (y+1) * 0.5) * 20;
                    ctx.moveTo(px + offX, py + offY);
                    ctx.lineTo(px + nextOffX, (y+1)*size + nextOffY);
                }
                if(x < cols && y < rows) {
                    var nextOffX = Math.cos(t + (x+1) * 0.5 + (y+1) * 0.5) * 20;
                    var nextOffY = Math.sin(t + (x+1) * 0.5 + (y+1) * 0.5) * 20;
                    ctx.moveTo(px + offX, py + offY);
                    ctx.lineTo((x+1)*size + nextOffX, (y+1)*size + nextOffY);
                }
            }
        }
        ctx.stroke();
        requestAnimationFrame(draw);
    }
    draw();
})();