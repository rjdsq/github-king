(function() {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.05';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var width, height;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    function draw() {
        var w = canvas.width;
        var h = canvas.height;
        var idata = ctx.createImageData(w, h);
        var buffer32 = new Uint32Array(idata.data.buffer);
        for(var i = 0; i < buffer32.length; i++) {
            if(Math.random() < 0.5) buffer32[i] = 0xff000000;
        }
        ctx.putImageData(idata, 0, 0);
        requestAnimationFrame(draw);
    }
    draw();
})();