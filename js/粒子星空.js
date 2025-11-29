const canvas = document.createElement('canvas');
canvas.style.cssText = "display:block; width:100%; height:100%;";
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d'); 
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight; 
let particlesArray; 

const particleColors = ['#00f5c3', '#ff2e88', '#66FF99', '#3366FF','#CC66FF'];

class Particle { 
    constructor(x, y, dX, dY, size, color) { 
        this.x=x; 
        this.y=y; 
        this.directionX=dX; 
        this.directionY=dY; 
        this.size=size; 
        this.color=color; 
    } 
    draw() { 
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false); 
        ctx.fillStyle=this.color; 
        ctx.fill(); 
    } 
    update() { 
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX; 
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY; 
        this.x+=this.directionX; 
        this.y+=this.directionY; 
        this.draw(); 
    } 
}

function initParticles() { 
    particlesArray = []; 
    let num = (canvas.height*canvas.width)/9000; 
    for(let i=0;i<num;i++){
        let size=Math.random()*1.5+1,
            x=Math.random()*(innerWidth-size*4)+size*2,
            y=Math.random()*(innerHeight-size*4)+size*2,
            dX=(Math.random()*.3)-.15,
            dY=(Math.random()*.3)-.15,
            color=particleColors[Math.floor(Math.random()*particleColors.length)];
        particlesArray.push(new Particle(x,y,dX,dY,size,color));
    } 
}

function animateParticles() { 
    requestAnimationFrame(animateParticles); 
    ctx.clearRect(0,0,canvas.width,canvas.height); 
    for(let i=0;i<particlesArray.length;i++) particlesArray[i].update(); 
}

window.addEventListener('resize', ()=>{ 
    canvas.width=innerWidth; 
    canvas.height=innerHeight; 
    initParticles(); 
}); 

initParticles(); 
animateParticles();