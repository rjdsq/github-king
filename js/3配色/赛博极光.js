(function() {
    const styleId = 'cloud-theme-cyber-aurora-ultimate';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* --- 核心变量系统 --- */
        :root {
            --cyber-bg-deep: #030712;
            --cyber-bg-gradient: radial-gradient(circle at 80% 0%, #1e1b4b 0%, #020617 100%);
            --cyber-glass: rgba(15, 23, 42, 0.85);
            --cyber-glass-hover: rgba(30, 41, 59, 0.7);
            --cyber-border: 1px solid rgba(56, 189, 248, 0.2);
            --cyber-border-active: 1px solid rgba(99, 102, 241, 0.6);
            --cyber-text-main: #e2e8f0;
            --cyber-text-muted: #94a3b8;
            --cyber-accent: #6366f1;
            --cyber-highlight: #38bdf8;
            --cyber-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
        }

        /* --- 1. 全局基础重置 --- */
        html, body {
            background: var(--cyber-bg-gradient) !important;
            color: var(--cyber-text-main) !important;
            -webkit-tap-highlight-color: transparent !important;
        }

        /* 选中文字效果 */
        ::selection {
            background: rgba(56, 189, 248, 0.3) !important;
            color: #fff !important;
            text-shadow: 0 0 5px #38bdf8 !important;
        }

        /* 全局滚动条 */
        ::-webkit-scrollbar {
            width: 4px !important;
            height: 4px !important;
            background: transparent !important;
        }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #4f46e5, #0ea5e9) !important;
            border-radius: 4px !important;
        }
        ::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1) !important;
        }

        /* --- 2. 布局容器 (Header/Footer/Toolbar) --- */
        header, footer, #toolbar, #multi-select-bar {
            background: var(--cyber-glass) !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
            border-bottom: var(--cyber-border) !important;
            border-top: var(--cyber-border) !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
        }

        /* 标题流光字 */
        #currentRepo, .auth-header h1, .modal-title-text {
            background: linear-gradient(to right, #38bdf8, #818cf8, #c084fc) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            color: transparent !important;
            font-weight: 800 !important;
            text-shadow: 0 0 30px rgba(56, 189, 248, 0.2) !important;
        }

        /* --- 3. 列表与卡片 (Repo/File List) --- */
        .file-item, .account-item, .publish-item, .proxy-item {
            background: linear-gradient(90deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%) !important;
            border: var(--cyber-border) !important;
            border-left: 2px solid rgba(99, 102, 241, 0.4) !important;
            border-radius: 8px !important;
            margin-bottom: 6px !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
            transition: all 0.2s ease !important;
        }

        .file-item:hover, .account-item:hover, .publish-item:hover, .proxy-item:hover {
            transform: translateX(4px) !important;
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%) !important;
            border-color: var(--cyber-highlight) !important;
            box-shadow: 0 0 15px rgba(56, 189, 248, 0.15) !important;
        }

        .file-name, .repo-name, .account-name {
            color: #f8fafc !important;
            font-weight: 600 !important;
        }

        .file-meta, .repo-description, .upload-size {
            color: var(--cyber-text-muted) !important;
            font-size: 0.75rem !important;
        }

        /* 列表图标发光 */
        .file-icon i, .fa-folder {
            filter: drop-shadow(0 0 5px rgba(99, 102, 241, 0.5)) !important;
        }

        /* --- 4. 模态框与弹窗 (Modals) --- */
        .modal-form-container, .modal-content, 
        .repo-overview-card, .repo-details-dialog, .publish-help-dialog,
        #contextMenu, .custom-dropdown, #mainMenuPopup,
        .auth-form, .modern-card {
            background: rgba(10, 14, 28, 0.96) !important;
            backdrop-filter: blur(25px) !important;
            border: 1px solid rgba(56, 189, 248, 0.3) !important;
            box-shadow: var(--cyber-shadow), inset 0 0 20px rgba(99, 102, 241, 0.05) !important;
            border-radius: 16px !important;
            color: var(--cyber-text-main) !important;
        }

        /* --- 5. 交互控件 (Inputs/Buttons) --- */
        input, textarea, select {
            background: rgba(2, 6, 23, 0.6) !important;
            border: 1px solid rgba(71, 85, 105, 0.5) !important;
            border-radius: 8px !important;
            color: #fff !important;
            caret-color: var(--cyber-highlight) !important;
        }

        input:focus, textarea:focus, select:focus {
            border-color: var(--cyber-highlight) !important;
            box-shadow: 0 0 15px rgba(56, 189, 248, 0.2) !important;
            background: rgba(2, 6, 23, 0.9) !important;
        }

        input::placeholder, textarea::placeholder {
            color: rgba(148, 163, 184, 0.6) !important;
        }

        .btn, button {
            border-radius: 8px !important;
            text-transform: none !important;
            font-weight: 600 !important;
            transition: all 0.3s !important;
        }

        /* 主按钮 - 霓虹渐变 */
        .btn-primary, #authBtn, .auth-button, .btn-primary-action {
            background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%) !important;
            box-shadow: 0 0 10px rgba(79, 70, 229, 0.4) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            color: #fff !important;
        }
        
        .btn-primary:hover, #authBtn:hover, .auth-button:hover {
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.6) !important;
            filter: brightness(1.2) !important;
        }

        /* 危险按钮 - 红色辉光 */
        .btn-danger, .btn-unpublish {
            background: linear-gradient(135deg, #9f1239 0%, #e11d48 100%) !important;
            border: 1px solid rgba(255, 60, 60, 0.3) !important;
            box-shadow: 0 0 10px rgba(225, 29, 72, 0.3) !important;
        }

        /* 次要按钮 */
        .btn-secondary, .btn-cancel, .btn-secondary-action {
            background: rgba(30, 41, 59, 0.6) !important;
            border: 1px solid rgba(148, 163, 184, 0.2) !important;
            color: #e2e8f0 !important;
        }

        /* 开关/滑块控件 */
        .switch .slider {
            background-color: #334155 !important;
        }
        .switch input:checked + .slider {
            background-color: var(--cyber-accent) !important;
            box-shadow: 0 0 10px var(--cyber-accent) !important;
        }

        /* --- 6. 侧边栏与特殊面板 --- */
        #sideNav, #apiStatusPanel {
            background: rgba(5, 8, 22, 0.98) !important;
            border-right: 1px solid rgba(56, 189, 248, 0.15) !important;
        }

        #sideNav li a {
            color: #94a3b8 !important;
            margin: 4px 12px !important;
            border-radius: 8px !important;
        }

        #sideNav li a:hover {
            background: linear-gradient(90deg, rgba(56, 189, 248, 0.15), transparent) !important;
            color: #fff !important;
            text-shadow: 0 0 8px rgba(56, 189, 248, 0.5) !important;
        }

        /* 帮助框 (Help Box) */
        .token-instructions, .publish-help-content code {
            background: rgba(15, 23, 42, 0.6) !important;
            border-left: 3px solid var(--cyber-accent) !important;
            color: #cbd5e1 !important;
        }

        /* --- 7. Ace Editor (代码编辑器) 深度适配 --- */
        .ace_editor {
            background-color: #0b1021 !important; 
            color: #e2e8f0 !important;
        }
        .ace_gutter {
            background: #0f172a !important;
            color: #64748b !important;
            border-right: 1px solid rgba(255,255,255,0.05) !important;
        }
        .ace_active-line {
            background: rgba(56, 189, 248, 0.1) !important;
        }
        .ace_cursor {
            color: var(--cyber-highlight) !important;
        }
        #editorSearchPanel {
            background: rgba(15, 23, 42, 0.95) !important;
            border: 1px solid var(--cyber-accent) !important;
        }

        /* --- 8. 杂项与微调 --- */
        /* Toast 通知 */
        #toast {
            background: rgba(0, 0, 0, 0.8) !important;
            border: 1px solid var(--cyber-highlight) !important;
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.3) !important;
            color: #fff !important;
            border-radius: 50px !important;
        }

        /* 空状态 */
        .empty-state, .publish-list-empty {
            color: #64748b !important;
        }
        .empty-state i {
            color: #334155 !important;
            filter: drop-shadow(0 0 0 transparent) !important;
        }

        /* 徽章/Tag */
        .badge, .version-badge, .author-tag {
            background: rgba(56, 189, 248, 0.15) !important;
            color: #38bdf8 !important;
            border: 1px solid rgba(56, 189, 248, 0.3) !important;
        }

        /* 选中高亮 */
        .file-item.selected {
            background: rgba(99, 102, 241, 0.2) !important;
            border-color: var(--cyber-accent) !important;
        }
        .select-checkbox-bg {
            border-color: var(--cyber-highlight) !important;
            background: transparent !important;
        }
        .file-item.selected .select-checkbox-bg {
            background: var(--cyber-highlight) !important;
            box-shadow: 0 0 10px var(--cyber-highlight) !important;
        }

        /* 进度条 */
        .upload-progress, .rate-limit-progress-bar > div {
            background: linear-gradient(90deg, #38bdf8, #818cf8) !important;
            box-shadow: 0 0 10px rgba(56, 189, 248, 0.5) !important;
        }
        .upload-progress-container {
            background: #1e293b !important;
        }
    `;
    document.head.appendChild(style);
})();