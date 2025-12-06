(function() {
    function createHeart(x, y) {
        var heart = document.createElement('div');
        heart.innerHTML = '❤';
        document.body.appendChild(heart);
        
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = Math.random() * 40 + 55 + 'px';
        heart.style.color = 'rgb(255, 107, 129)';
        heart.style.userSelect = 'none';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '999999';
        heart.style.textShadow = '0 0 5px rgba(255, 107, 129, 0.5)';
        heart.style.fontFamily = 'Arial, sans-serif';
        heart.style.transition = 'all 1s ease-out';
        
        var startTime = null;
        var duration = 1000;
        var initialX = x;
        var initialY = y;
        var xOffset = Math.random() * 50 - 30;
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = timestamp - startTime;
            
            if (progress < duration) {
                var ratio = progress / duration;
                var currentY = initialY - (progress * 0.1);
                var currentX = initialX + Math.sin(progress * 0.01) * 2 + (ratio * xOffset);
                
                heart.style.top = currentY + 'px';
                heart.style.left = currentX + 'px';
                heart.style.opacity = 1 - ratio;
                heart.style.transform = 'scale(' + (1 + ratio * 0.5) + ')';
                
                requestAnimationFrame(animate);
            } else {
                heart.remove();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    document.addEventListener('click', function(e) {
        createHeart(e.clientX, e.clientY);
    });
})();