function createClickEffect(x, y) {
    var effect = document.createElement("div");
    effect.className = "clickEffect";
    document.body.appendChild(effect);
    effect.style.left = (x - 20) + "px";
    effect.style.top = (y - 20) + "px";
    var randomColor = 'hsl(' + Math.random() * 360 + ', 90%, 50%)'
    effect.style.borderColor = randomColor;
    effect.addEventListener('animationend', function () {
        document.body.removeChild(effect);
    })
}

document.addEventListener('click', function (event) {
    createClickEffect(event.pageX, event.pageY);
})

var style = document.createElement('style');
style.textContent = `
.clickEffect {
    position: absolute;
    z-index: 999999;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 4px solid transparent;
    animation: clickEffectAnimation 0.7s ease-out;
    pointer-events: none;
    box-sizing: border-box;
}

@keyframes clickEffectAnimation {
0%{
    transform: scale(0);
    opacity:1;
}
    100%{
        transform: scale(1.8);
        opacity:0;
    }
}
`

document.head.appendChild(style);