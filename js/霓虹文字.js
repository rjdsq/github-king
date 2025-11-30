/**
 * 特效名称: 全局界面霓虹化 (UI Neon)
 * 描述: 将界面上的文字、边框和图标转换为霓虹发光风格，但不影响代码编辑器内容。
 * 作者: 牡丹君 (定制版)
 */

(function() {
    // 防止重复加载
    if (document.getElementById('ui-neon-style')) return;

    // 定义霓虹色系变量
    const neonBlue = '#00f3ff';
    const neonPink = '#ff00ff';
    const neonGreen = '#0aff0a';
    const neonYellow = '#f1c40f';
    const neonRed = '#ff3333';

    // 构建 CSS
    const css = `
        /* --- 1. 全局文字发光基础 (排除编辑器) --- */
        body {
            text-shadow: 0 0 2px rgba(150, 150, 255, 0.3);
        }

        /* --- 2. 登录页 & 标题 --- */
        .auth-header h1, 
        .auth-header i {
            color: #fff !important;
            text-shadow: 
                0 0 5px #fff,
                0 0 10px ${neonPink},
                0 0 20px ${neonPink},
                0 0 40px ${neonPink} !important;
            animation: neon-flicker 3s infinite alternate;
        }

        /* --- 3. 顶部导航栏 --- */
        #currentRepo {
            color: #e0f7fa !important;
            font-weight: bold;
            text-shadow: 0 0 5px ${neonBlue}, 0 0 10px ${neonBlue};
            letter-spacing: 1px;
        }
        
        /* 顶部图标发光 */
        header button i {
            filter: drop-shadow(0 0 3px ${neonBlue});
        }

        /* --- 4. 文件列表 (核心区域) --- */
        /* 列表项边框发光 */
        .file-item {
            border: 1px solid rgba(0, 243, 255, 0.3) !important;
            box-shadow: inset 0 0 5px rgba(0, 243, 255, 0.1);
            background-color: rgba(0, 10, 20, 0.6) !important;
            transition: all 0.3s ease;
        }
        
        .file-item:hover {
            box-shadow: 0 0 15px rgba(0, 243, 255, 0.4), inset 0 0 10px rgba(0, 243, 255, 0.2);
            border-color: ${neonBlue} !important;
        }

        /* 文件名 - 赛博绿 */
        .file-name {
            color: #ccffcc !important;
            font-family: 'Courier New', monospace; /* 增加代码感 */
            text-shadow: 0 0 3px ${neonGreen};
            font-weight: 500;
        }

        /* 文件夹图标发光 */
        .file-icon i.fa-folder {
            filter: drop-shadow(0 0 5px #ff9800);
        }
        
        /* 普通文件图标发光 */
        .file-icon i:not(.fa-folder) {
            filter: drop-shadow(0 0 4px ${neonBlue});
        }

        /* 选中状态极亮 */
        .file-item.selected {
            background-color: rgba(188, 19, 254, 0.2) !important;
            border-color: ${neonPink} !important;
            box-shadow: 0 0 15px ${neonPink} !important;
        }

        /* --- 5. 按钮与图标 --- */
        /* 底部导航栏发光 */
        footer {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 -2px 10px rgba(0, 243, 255, 0.1);
        }

        footer button i {
            filter: drop-shadow(0 0 5px currentColor);
        }

        /* 通用按钮发光 */
        .btn-primary {
            background: transparent !important;
            border: 1px solid ${neonGreen} !important;
            color: ${neonGreen} !important;
            box-shadow: 0 0 5px ${neonGreen}, inset 0 0 5px ${neonGreen} !important;
            text-shadow: 0 0 3px ${neonGreen};
        }
        
        .btn-primary:hover {
            background: ${neonGreen} !important;
            color: #000 !important;
            box-shadow: 0 0 15px ${neonGreen} !important;
            text-shadow: none;
        }

        .btn-danger {
            background: transparent !important;
            border: 1px solid ${neonRed} !important;
            color: ${neonRed} !important;
            box-shadow: 0 0 5px ${neonRed}, inset 0 0 5px ${neonRed} !important;
            text-shadow: 0 0 3px ${neonRed};
        }

        /* --- 6. 弹窗与侧边栏 --- */
        .modal-form-container, 
        .context-menu-item, 
        #sideNav, 
        #contextMenu {
            background-color: rgba(10, 15, 30, 0.95) !important;
            border: 1px solid ${neonBlue} !important;
            box-shadow: 0 0 15px rgba(0, 243, 255, 0.2) !important;
        }

        .modal-title-text {
            text-shadow: 0 0 8px ${neonBlue};
            color: #fff !important;
        }

        /* 侧边栏链接 */
        #sideNav li a {
            color: #a2a7c7;
            transition: 0.3s;
        }
        #sideNav li a:hover, 
        #sideNav li a.active {
            color: #fff;
            text-shadow: 0 0 5px ${neonPink}, 0 0 10px ${neonPink};
        }

        /* --- 7. 【关键】保护编辑器内容原样显示 --- */
        /* 强制覆盖，取消编辑器内的所有发光效果，保持高亮清晰 */
        #editModal .modal-content,
        #fileContent,
        #fileContent::selection,
        .editor-container {
            text-shadow: none !important;
            box-shadow: none !important;
            filter: none !important;
            font-family: monospace !important; /* 确保字体正常 */
        }
        
        /* 仅让编辑器的边框稍微发一点光，作为容器边界 */
        #fileContent {
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        /* --- 8. 闪烁动画定义 --- */
        @keyframes neon-flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                opacity: 1;
                text-shadow: 
                    0 0 5px #fff,
                    0 0 10px ${neonPink},
                    0 0 20px ${neonPink};
            }
            20%, 24%, 55% {
                opacity: 0.5;
                text-shadow: none;
            }
        }
    `;

    // 创建 style 标签并注入
    const style = document.createElement('style');
    style.id = 'ui-neon-style';
    style.innerHTML = css;
    document.head.appendChild(style);

    // 提示用户
    if (typeof showToast === 'function') {
        showToast('UI 霓虹模式已激活', 'success');
    }
})();