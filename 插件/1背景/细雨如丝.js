(function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var w, h;
    var drops = [];
    var maxDrops = 100;
    var animationId;

    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.appendChild(canvas);

    function init() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        
        var density = w < 600 ? 30 : 10; 
        maxDrops = Math.floor(w / density);
        
        drops = [];
        for (var i = 0; i < maxDrops; i++) {
            drops.push({
                x: Math.random() * w,
                y: Math.random() * h,
                l: Math.random() * 10 + 20,
                s: Math.random() * 2 + 3
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(174,194,224,0.6)';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        ctx.beginPath();
        for (var i = 0; i < drops.length; i++) {
            var d = drops[i];
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x, d.y + d.l);
            
            d.y += d.s;

            if (d.y > h) {
                d.y = -d.l;
                d.x = Math.random() * w;
                d.s = Math.random() * 2 + 3;
            }
        }
        ctx.stroke();
        animationId = requestAnimationFrame(draw);
    }

    init();
    draw();

    var resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            cancelAnimationFrame(animationId);
            init();
            draw();
        }, 200);
    });
})();