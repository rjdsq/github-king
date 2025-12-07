(function() {
    document.addEventListener('click', function(e) {
        var ripple = document.createElement('div');
        document.body.appendChild(ripple);
        
        var size = 100;
        ripple.style.position = 'fixed';
        ripple.style.left = (e.clientX - size / 2) + 'px';
        ripple.style.top = (e.clientY - size / 2) + 'px';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.borderRadius = '50%';
        ripple.style.border = '2px solid rgba(0, 150, 255, 0.6)';
        ripple.style.boxSizing = 'border-box';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '999999';
        
        var scale = 0;
        var opacity = 1;
        
        function animate() {
            scale += 0.04;
            opacity -= 0.02;
            
            if (opacity <= 0) {
                ripple.remove();
                return;
            }
            
            ripple.style.transform = 'scale(' + scale + ')';
            ripple.style.opacity = opacity;
            ripple.style.borderWidth = (2 * opacity) + 'px';
            
            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
    });
})();