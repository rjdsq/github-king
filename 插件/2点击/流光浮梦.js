/**
 * 插件名称：流光·浮梦 (极速版)
 * 描述：针对高分屏优化的滑动作视差特效，移除耗能渲染，极致流畅。
 * 适配核心：CloudEffectManager V3.0
 */

(function() {
    // --- 极速版配置 ---
    const CONFIG = {
        particleCount: 35,        // 粒子数量 (适量减少以提升性能)
        baseColorHue: 210,        // 基础色相 (清透蓝)
        scrollSensitivity: 0.8,   // 视差灵敏度 (提高一点，让动态更明显)
        clickBurstCount: 8,       // 点击产生的粒子数
    };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true }); // 开启透明通道优化
    
    // 强制使用硬件加速
    canvas.style.cssText = 'display:block; width:100%; height:100%; transform: translateZ(0); will-change: transform;';
    document.body.appendChild(canvas);

    let width, height;
    let particles = [];
    let bursts = [];
    let hue = CONFIG.baseColorHue;
    let lastScrollTop = 0;
    let scrollVelocity = 0;

    // --- 尺寸同步 ---
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    // --- 氛围粒子 (背景) ---
    class AmbientParticle {
        constructor() {
            this.init(true);
        }

        init(randomY = false) {
            this.x = Math.random() * width;
            this.y = randomY ? Math.random() * height : (scrollVelocity > 0 ? height + 10 : -10);
            
            // 在3倍虚拟分辨率下，粒子尺寸要适当
            this.size = Math.random() * 3 + 1.5; 
            this.speedY = Math.random() * 0.4 - 0.2;
            this.speedX = Math.random() * 0.4 - 0.2;
            
            this.alpha = 0; // 初始透明度
            this.targetAlpha = Math.random() * 0.6 + 0.2; // 目标透明度
            this.fadeIn = true;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // 视差核心：根据父级滚动速度移动
            // 大粒子移动得快，模拟近大远小的 3D 空间感
            this.y -= scrollVelocity * CONFIG.scrollSensitivity * this.size;

            // 淡入淡出优化 (代替复杂的呼吸计算)
            if (this.fadeIn) {
                this.alpha += 0.01;
                if (this.alpha >= this.targetAlpha) this.fadeIn = false;
            }

            // 边界检查 (屏幕外重置)
            const margin = 50;
            if (this.x < -margin || this.x > width + margin || this.y < -margin || this.y > height + margin) {
                // 如果是因为滚动导致的移出，立即在另一侧生成，保持连续性
                if (Math.abs(scrollVelocity) > 1) {
                    this.x = Math.random() * width;
                    this.y = scrollVelocity > 0 ? height + margin : -margin;
                } else {
                    this.init(true);
                }
            }
        }

        draw() {
            // 性能优化：不绘制肉眼不可见的粒子
            if (this.alpha <= 0.01) return;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // 直接填充颜色，不使用 shadowBlur
            ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${this.alpha})`;
            ctx.fill();
        }
    }

    // --- 爆发粒子 (交互) ---
    class BurstParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 3;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.size = Math.random() * 5 + 2;
            this.life = 1.0;
            // 交互粒子的颜色稍微亮一点
            this.color = hue + 40; 
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.92; // 快速摩擦力，让爆发感更强
            this.vy *= 0.92;
            this.size *= 0.94;
            this.life -= 0.04;
        }

        draw() {
            if (this.life <= 0) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.color}, 90%, 60%, ${this.life})`;
            ctx.fill();
        }
    }

    // --- 初始化 ---
    for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push(new AmbientParticle());
    }

    // --- 事件监听 (保持原有的智能逻辑) ---
    window.addEventListener('parentScroll', (e) => {
        const scrollTop = e.detail.scrollTop;
        const delta = scrollTop - lastScrollTop;
        // 限制最大速度，防止滑动过快时粒子瞬移
        scrollVelocity = Math.max(-30, Math.min(30, delta));
        lastScrollTop = scrollTop;
    });

    const handleInteraction = (e) => {
        // 限制同时存在的爆发粒子总数，防止连点卡顿
        if (bursts.length > 40) bursts.splice(0, 10);
        
        for (let i = 0; i < CONFIG.clickBurstCount; i++) {
            bursts.push(new BurstParticle(e.clientX, e.clientY));
        }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('mousedown', handleInteraction);

    // --- 渲染循环 ---
    function animate() {
        // 性能优化关键：完全清除画布，而不是覆盖半透明层
        // 虽然没了长拖尾，但性能提升巨大，且画面更干净
        ctx.clearRect(0, 0, width, height);

        // 颜色缓慢流转
        hue += 0.2;
        
        // 滚动惯性衰减
        scrollVelocity *= 0.92;
        if (Math.abs(scrollVelocity) < 0.1) scrollVelocity = 0;

        // 绘制背景粒子
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            p.draw();
        }

        // 绘制交互粒子 (倒序循环以便安全删除)
        for (let i = bursts.length - 1; i >= 0; i--) {
            const b = bursts[i];
            b.update();
            b.draw();
            if (b.life <= 0 || b.size < 0.5) {
                bursts.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
})();