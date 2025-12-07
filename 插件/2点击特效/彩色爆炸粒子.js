(function() {
    var colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#ff6b81', '#70a1ff', '#7bed9f', '#5352ed'];
    
    function createParticle(x, y) {
        var particle = document.createElement('div');
        document.body.appendChild(particle);
        
        var size = Math.floor(Math.random() * 8 + 8);
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999999';
        
        var angle = Math.random() * Math.PI * 2;
        var velocity = 2 + Math.random() * 2;
        var vx = Math.cos(angle) * velocity;
        var vy = Math.sin(angle) * velocity;
        var life = 1;
        
        function update() {
            life -= 0.02;
            if (life <= 0) {
                particle.remove();
                return;
            }
            
            var rect = particle.getBoundingClientRect();
            particle.style.left = (rect.left + vx) + 'px';
            particle.style.top = (rect.top + vy) + 'px';
            particle.style.opacity = life;
            particle.style.transform = 'scale(' + life + ')';
            
            requestAnimationFrame(update);
        }
        
        requestAnimationFrame(update);
    }
    
    document.addEventListener('click', function(e) {
        var amount = 15;
        for (var i = 0; i < amount; i++) {
            createParticle(e.clientX, e.clientY);
        }
    });
})();