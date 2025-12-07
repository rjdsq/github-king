(function() {
    const css = `
    @keyframes glitch-click {
        0% { transform: translate(-50%, -50%) scale(1) skew(0deg); opacity: 1; text-shadow: 2px 0 red, -2px 0 blue; }
        20% { transform: translate(-55%, -45%) scale(1.1) skew(10deg); text-shadow: -2px 0 red, 2px 0 blue; }
        40% { transform: translate(-45%, -55%) scale(0.9) skew(-10deg); opacity: 0.8; filter: invert(1); }
        60% { transform: translate(-50%, -50%) scale(1.2) skew(5deg); opacity: 0.6; }
        100% { transform: translate(-50%, -50%) scale(0) skew(0deg); opacity: 0; }
    }`;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    document.addEventListener('click', function(e) {
        const el = document.createElement('div');
        el.innerHTML = '💘';
        el.style.position = 'fixed';
        el.style.left = e.clientX + 'px';
        el.style.top = e.clientY + 'px';
        el.style.fontSize = '40px';
        el.style.color = '#fff';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '10000';
        el.style.fontFamily = 'Courier New';
        el.style.fontWeight = 'bold';
        el.style.animation = 'glitch-click 0.5s linear forwards';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 400);
    });
})();