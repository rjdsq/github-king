/**
 * 插件名称：流光边框 (修复版)
 * 描述：修复导致列表不显示的问题，增强亮色模式可见度
 * 适配核心：CloudEffectManager V3.0
 */

(function() {
    // 获取父级文档对象
    const doc = window.parent.document;
    const styleId = 'plugin-adaptive-border-style-v2';

    // 1. 清理旧样式
    const oldStyle = doc.getElementById(styleId);
    if (oldStyle) oldStyle.remove();

    // 2. 定义动态 CSS
    // 关键修复：使用 ::after 伪元素，不占用主元素的 animation 属性
    const css = `
        /* --- 基础设置 --- */
        .file-item {
            position: relative; /* 确保伪元素定位准确 */
            overflow: visible !important; /* 允许光晕溢出一点点 */
            border-color: transparent !important; /* 隐藏原本的边框，由伪元素接管 */
        }

        /* 创建流光层 */
        .file-item::after {
            content: '';
            position: absolute;
            top: -1px; left: -1px; right: -1px; bottom: -1px; /* 覆盖原有边框位置 */
            border-radius: inherit; /* 继承圆角 */
            border-width: 1px;
            border-style: solid;
            pointer-events: none; /* 允许点击穿透 */
            z-index: 2; /* 浮在内容边框之上 */
            opacity: 0; /* 初始透明，等待淡入 */
            transition: opacity 0.5s ease;
        }

        /* 列表加载完成后显示边框 */
        .file-item::after {
            opacity: 1;
        }

        /* --- 暗色主题动画 (Dark Theme) --- */
        @keyframes border-breath-dark {
            0% {
                border-color: #22d3ee; /* Cyan */
                box-shadow: 0 0 5px rgba(34, 211, 238, 0.2), inset 0 0 5px rgba(34, 211, 238, 0.1);
            }
            50% {
                border-color: #a78bfa; /* Violet */
                box-shadow: 0 0 8px rgba(167, 139, 250, 0.3), inset 0 0 8px rgba(167, 139, 250, 0.15);
            }
            100% {
                border-color: #f472b6; /* Pink */
                box-shadow: 0 0 5px rgba(244, 114, 182, 0.2), inset 0 0 5px rgba(244, 114, 182, 0.1);
            }
        }

        /* --- 亮色主题动画 (Light Theme - 高对比度优化) --- */
        @keyframes border-breath-light {
            0% {
                border-color: #0284c7; /* 深天蓝 (更深) */
                background-color: rgba(224, 242, 254, 0.3);
            }
            50% {
                border-color: #4f46e5; /* 靛青 (更深) */
                background-color: rgba(238, 242, 255, 0.3);
            }
            100% {
                border-color: #059669; /* 翡翠绿 (更深) */
                background-color: rgba(236, 253, 245, 0.3);
            }
        }

        /* --- 应用规则：暗色模式 --- */
        body:not(.light-theme) .file-item::after {
            animation: border-breath-dark 4s ease-in-out infinite alternate;
        }

        /* --- 应用规则：亮色模式 --- */
        body.light-theme .file-item::after {
            animation: border-breath-light 6s ease-in-out infinite alternate;
            border-width: 1.5px; /* 亮色模式下边框稍微加粗一点点，更明显 */
        }

        /* --- 选中状态增强 (覆盖动画) --- */
        
        /* 暗色选中 */
        body:not(.light-theme) .file-item.selected::after {
            animation: none !important;
            border-color: #34d399 !important; /* 亮绿 */
            box-shadow: 0 0 10px rgba(52, 211, 153, 0.4) !important;
        }

        /* 亮色选中 */
        body.light-theme .file-item.selected::after {
            animation: none !important;
            border-color: #dc2626 !important; /* 鲜红/深红，在亮色下极度明显 */
            border-width: 2px;
            background-color: transparent !important; /* 选中时背景由主样式控制，这里只管边框 */
        }
    `;

    // 3. 注入样式
    const style = doc.createElement('style');
    style.id = styleId;
    style.textContent = css;
    doc.head.appendChild(style);

})();