/**
 * 插件名称：流光·浮梦
 * 描述：集成了滑动视差与点击涟漪的唯美光效
 * 适配核心：CloudEffectManager V3.0 (虚拟分辨率 + 全能事件代理)
 */

(function() {
    // --- 配置参数 ---
    const CONFIG = {
        particleCount: 60,        // 氛围粒子数量
        baseColorHue: 220,        // 基础色相 (220=蓝紫)
        colorCyclingSpeed: 0.1,   // 颜色流转速度
        scrollSensitivity: 0.5,   // 滑动视差灵敏度
        clickBurstCount: 12,      // 点击产生的粒子数
    };

    // --- 初始化画布 ---
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置全屏 (Iframe 内部已经是 300% 大小，这里只需填充)
    canvas.style.cssText = 'display:block; width:100%; height:100%;';
    document.body.appendChild(canvas);

    let width, height;
    let particles = [];
    let bursts = [];
    let hue = CONFIG.baseColorHue;
    
    // 滚动相关状态
    let lastScrollTop = 0;
    let scrollVelocity = 0;

    // --- 调整尺寸 ---
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    // --- 粒子类 (氛围背景) ---
    class AmbientParticle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // 基础大小 (配合3.0倍率，这实际上是细腻的小点)
            this.size = Math.random() * 4 + 1; 
            this.speedY = Math.random() * 0.5 - 0.25;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.life = Math.random() * 0.5 + 0.2; // 透明度
            this.decay = Math.random() * 0.005 + 0.002; // 呼吸速度
            this.growing = Math.random() > 0.5;
        }

        update() {
            // 基础移动
            this.x += this.speedX;
            this.y += this.speedY;

            // 核心：滑动视差效果
            // 当主界面滚动时，粒子会根据滚动速度产生反向或同向位移，制造层次感
            // 越大的粒子受滚动影响越小（模拟远近关系）
            this.y -= scrollVelocity * CONFIG.scrollSensitivity * (this.size / 2);

            // 呼吸效果 (透明度变化)
            if (this.growing) {
                this.life += this.decay;
                if (this.life > 0.8) this.growing = false;
            } else {
                this.life -= this.decay;
                if (this.life < 0.2) this.growing = true;
            }

            // 边界检查与重置
            if (this.x < -10 || this.x > width + 10 || this.y < -10 || this.y > height + 10) {
                // 如果是因为滚动出了屏幕，重置到另一端
                if (this.y < -10 && scrollVelocity > 0) this.y = height + 10;
                else if (this.y > height + 10 && scrollVelocity < 0) this.y = -10;
                else this.init(); // 随机重置
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // 使用 HSLA 颜色，颜色随时间流转
            ctx.fillStyle = `hsla(${hue}, 70%, 65%, ${this.life})`;
            ctx.fill();
            
            // 添加柔光晕
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = `hsla(${hue}, 70%, 65%, ${this.life})`;
        }
    }

    // --- 爆发粒子类 (点击交互) ---
    class BurstParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2; // 爆发速度
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.size = Math.random() * 6 + 2;
            this.life = 1; // 完整生命周期
            this.color = hue + Math.random() * 40 - 20; // 稍微偏色
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.95; // 摩擦力
            this.vy *= 0.95;
            this.size *= 0.96; // 变小
            this.life -= 0.03; // 消失
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.color}, 80%, 70%)`;
            ctx.fill();
            ctx.restore();
        }
    }

    // --- 初始化氛围粒子 ---
    for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push(new AmbientParticle());
    }

    // --- 核心交互逻辑 ---

    // 1. 监听父级滚动 (CloudEffectManager 特有功能)
    // 这里的 'parentScroll' 是由管理器合成并分发的自定义事件
    window.addEventListener('parentScroll', (e) => {
        const scrollTop = e.detail.scrollTop;
        // 计算滚动速度 (当前位置 - 上次位置)
        // 限制最大速度防止粒子瞬移
        scrollVelocity = Math.max(-20, Math.min(20, scrollTop - lastScrollTop));
        lastScrollTop = scrollTop;
    });

    // 2. 监听点击/触摸 (管理器已将坐标转换为 Iframe 内部坐标)
    const handleInteraction = (e) => {
        // 创建点击涟漪效果
        for (let i = 0; i < CONFIG.clickBurstCount; i++) {
            bursts.push(new BurstParticle(e.clientX, e.clientY));
        }
        
        // 点击时颜色突变一下，增加动感
        hue += 30;
    };

    window.addEventListener('click', handleInteraction);
    // 同时也支持原生的 mousedown 以获得更快的响应
    window.addEventListener('mousedown', handleInteraction);

    // --- 动画循环 ---
    function animate() {
        // 拖尾效果：不完全清除画布，而是覆盖一层半透明背景
        // 这会让移动的粒子产生漂亮的尾迹
        ctx.fillStyle = 'rgba(10, 15, 30, 0.2)'; // 深色背景适配
        // 如果是亮色模式适配 (可选)
        // ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; 
        
        // 为了支持透明背景（混合模式），我们这里使用 clearRect
        // 如果想要拖尾，可以改用 fillRect 覆盖
        ctx.clearRect(0, 0, width, height);

        // 颜色流转
        hue += CONFIG.colorCyclingSpeed;
        if (hue > 360) hue = 0;

        // 滚动速度衰减 (模拟惯性停止)
        scrollVelocity *= 0.9;
        if (Math.abs(scrollVelocity) < 0.1) scrollVelocity = 0;

        // 绘制混合模式 (让光效叠加更亮)
        ctx.globalCompositeOperation = 'lighter';

        // 更新氛围粒子
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // 更新爆发粒子
        for (let i = bursts.length - 1; i >= 0; i--) {
            const b = bursts[i];
            b.update();
            b.draw();
            if (b.life <= 0) {
                bursts.splice(i, 1);
            }
        }

        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(animate);
    }

    animate();
})();