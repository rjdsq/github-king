
(function() {
    var existing = document.getElementById('snow_canvas_overlay');
    if (existing) existing.remove();

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var width = window.innerWidth;
    var height = window.innerHeight;
    var flakes = [];
    var flakeCount = 250;

    canvas.id = "snow_canvas_overlay";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;pointer-events:none;";
    document.body.appendChild(canvas);

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener("resize", resize);
    resize();

    function createFlake(initial) {
        var r = Math.random() * 3 + 1;
        var x, y;
        
        if (initial) {
            x = Math.random() * width;
            y = Math.random() * height;
        } else {
            if (Math.random() > 0.5) {
                x = Math.random() * width + (width * 0.2); 
                y = -10;
            } else {
                x = width + 10;
                y = Math.random() * height;
            }
        }

        return {
            x: x,
            y: y,
            r: r,
            speed: r * 0.4 + Math.random() * 0.6,
            wind: r * 0.3 + 0.5, 
            swing: Math.random() * Math.PI * 2,
            swingSpeed: 0.02 + Math.random() * 0.03,
            opacity: 0.4 + Math.random() * 0.6
        };
    }

    function init() {
        for (var i = 0; i < flakeCount; i++) {
            flakes.push(createFlake(true));
        }
        loop();
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);

        for (var i = 0; i < flakeCount; i++) {
            var f = flakes[i];

            f.swing += f.swingSpeed;
            f.y += f.speed;
            f.x -= f.wind + Math.cos(f.swing) * 0.5; 

            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, " + (f.r / 4 * f.opacity) + ")";
            ctx.fill();

            if (f.y > height || f.x < -20) {
                flakes[i] = createFlake(false);
            }
        }
        requestAnimationFrame(loop);
    }

    init();
})();