/**
 * 特效名称: 赛博霓虹文字 (Cyber Neon Text)
 * 描述: 漂浮的、闪烁的编程关键词，营造赛博朋克氛围
 * 作者: 牡丹君 (定制版)
 */

(function() {
    // 1. 初始化 Canvas
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    
    // 关键词库 - 可以自己添加喜欢的词
    const KEYWORDS = [
        'GIT', 'PUSH', 'PULL', '404', '200', 'NULL', 'ROOT', 
        'SUDO', 'API', 'JSON', 'XML', 'VOID', 'CONST', 'LET',
        'FUNC', 'ASYNC', 'AWAIT', 'HEAD', 'MASTER', 'MAIN',
        'DEBUG', 'ERROR', 'WARN', 'INFO', 'LOG', 'SRC'
    ];

    // 霓虹配色表
    const COLORS = [
        '#ff00ff', // 赛博粉
        '#00ffff', // 电光蓝
        '#00ff00', // 黑客绿
        '#ff3333', // 警示红
        '#ffff00'  // 柠檬黄
    ];

    // 粒子数组
    const particles = [];
    const PARTICLE_COUNT = 40; // 屏幕上同时存在的文字数量

    // 调整尺寸
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 2. 文字粒子类
    class NeonWord {
        constructor() {
            this.reset(true);
        }

        reset(isInitial = false) {
            this.x = Math.random() * width;
            // 初始时随机分布，后续从底部生成或顶部生成
            this.y = isInitial ? Math.random() * height : height + 50;
            
            // 随机速度 (负数向上漂浮)
            this.vy = -0.5 - Math.random() * 1.5;
            this.vx = (Math.random() - 0.5) * 0.5; // 轻微左右摆动

            this.text = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
            this.baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            
            // 大小模拟景深 (12px - 40px)
            this.size = 12 + Math.random() * 28;
            
            // 闪烁参数
            this.opacity = Math.random() * 0.5 + 0.5;
            this.flickerSpeed = Math.random() * 0.1;
            this.flickerOffset = Math.random() * 100;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // 模拟霓虹灯闪烁 (利用正弦波产生不规则透明度)
            const time = Date.now() * 0.01;
            // 基础透明度 + 随机闪烁
            if (Math.random() < 0.05) { // 5%概率发生剧烈闪烁
                this.opacity = Math.random(); 
            } else {
                this.opacity = 0.6 + Math.sin(time * this.flickerSpeed + this.flickerOffset) * 0.4;
            }
            // 限制透明度范围
            this.opacity = Math.max(0.1, Math.min(1, this.opacity));

            // 超出屏幕顶部重置
            if (this.y < -50) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            
            // 设置字体
            ctx.font = `bold ${this.size}px "Courier New", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 关键：设置发光效果
            // 1. 阴影作为外发光
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.baseColor;
            
            // 2. 填充样式 (核心亮白，边缘带色)
            // 使用 rgba 控制闪烁
            ctx.fillStyle = this.hexToRgba(this.baseColor, this.opacity);
            
            // 3. 描边样式 (增加霓虹管的感觉)
            // 只有大字体才描边，避免小字体太乱
            if (this.size > 25) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 1;
                ctx.strokeText(this.text, this.x, this.y);
            }

            ctx.fillText(this.text, this.x, this.y);

            ctx.restore();
        }

        // 辅助：Hex转Rgba
        hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    }

    // 初始化粒子
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new NeonWord());
    }

    // 3. 动画循环
    function animate() {
        // 清空画布 (完全清空，保持透明背景)
        ctx.clearRect(0, 0, width, height);

        // 可选：为了增强光晕，可以使用 'lighter' 或 'screen' 混合模式
        // 但要注意这可能导致文字重叠处过亮，这里我们只在绘制时开启
        ctx.globalCompositeOperation = 'screen';

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        ctx.globalCompositeOperation = 'source-over'; // 恢复默认

        requestAnimationFrame(animate);
    }

    animate();
})();