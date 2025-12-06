/**
 * 插件名称：流光边框 (Adaptive Glow)
 * 描述：为仓库列表添加随主题变化的动态呼吸边框
 * 适配核心：CloudEffectManager V3.0 (跨域注入支持)
 */

(function() {
    // 获取父级文档对象 (因为插件在 Iframe 中运行，需要操作外层 UI)
    const doc = window.parent.document;
    const styleId = 'plugin-adaptive-border-style';

    // 1. 清理旧样式 (防止重复加载叠加)
    const oldStyle = doc.getElementById(styleId);
    if (oldStyle) oldStyle.remove();

    // 2. 定义动态 CSS
    const css = `
        /* --- 基础设置：平滑过渡 --- */
        .file-item {
            transition: border-color 0.5s ease, box-shadow 0.5s ease, background-color 0.3s !important;
            border-width: 1px !important;
            border-style: solid !important;
        }

        /* --- 暗色主题动画 (Dark Theme) --- */
        @keyframes neon-breath-dark {
            0% {
                border-color: rgba(34, 211, 238, 0.6); /* Cyan */
                box-shadow: 0 0 8px rgba(34, 211, 238, 0.15) inset;
            }
            50% {
                border-color: rgba(167, 139, 250, 0.6); /* Violet */
                box-shadow: 0 0 12px rgba(167, 139, 250, 0.2) inset;
            }
            100% {
                border-color: rgba(244, 114, 182, 0.6); /* Pink */
                box-shadow: 0 0 8px rgba(244, 114, 182, 0.15) inset;
            }
        }

        /* --- 亮色主题动画 (Light Theme) --- */
        @keyframes nature-breath-light {
            0% {
                border-color: #0ea5e9; /* Sky Blue */
                background-color: rgba(240, 249, 255, 0.6);
            }
            50% {
                border-color: #6366f1; /* Indigo */
                background-color: rgba(238, 242, 255, 0.6);
            }
            100% {
                border-color: #10b981; /* Emerald */
                background-color: rgba(236, 253, 245, 0.6);
            }
        }

        /* --- 应用规则：暗色模式 (默认) --- */
        body:not(.light-theme) .file-item {
            /* 6秒循环，交替反向，丝般顺滑 */
            animation: neon-breath-dark 6s ease-in-out infinite alternate;
        }
        
        /* 选中状态增强 (暗色) */
        body:not(.light-theme) .file-item.selected {
            animation: none !important;
            border-color: #34d399 !important;
            box-shadow: 0 0 15px rgba(52, 211, 153, 0.3) inset !important;
        }

        /* --- 应用规则：亮色模式 --- */
        body.light-theme .file-item {
            animation: nature-breath-light 6s ease-in-out infinite alternate;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03) !important; /* 亮色下加一点点投影增加立体感 */
        }

        /* 选中状态增强 (亮色) */
        body.light-theme .file-item.selected {
            animation: none !important;
            border-color: #4f46e5 !important;
            background-color: #eef2ff !important;
        }
    `;

    // 3. 注入样式到父级 Head
    const style = doc.createElement('style');
    style.id = styleId;
    style.textContent = css;
    doc.head.appendChild(style);

    console.log('流光边框插件已加载');

})();