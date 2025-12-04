(function() {
    const styleId = 'cloud-theme-cyber-aurora';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        :root {
            --cyber-bg: #0b1021;
            --cyber-card: rgba(30, 41, 59, 0.6);
            --cyber-border: rgba(99, 102, 241, 0.4);
            --cyber-accent: #6366f1;
            --cyber-text-main: #e0f2fe;
            --cyber-text-sub: #a5b4fc;
            --cyber-text-dim: #64748b;
            --cyber-highlight: #38bdf8;
        }

        body {
            background: radial-gradient(circle at top right, #1e1b4b 0%, #020617 100%) !important;
            color: var(--cyber-text-main) !important;
        }

        ::-webkit-scrollbar {
            width: 4px !important;
            height: 4px !important;
            background: transparent !important;
        }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #6366f1, #38bdf8) !important;
            border-radius: 4px !important;
        }
        ::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2) !important;
        }

        header, footer, #toolbar {
            background: rgba(15, 23, 42, 0.75) !important;
            backdrop-filter: blur(16px) saturate(180%) !important;
            border-bottom: 1px solid rgba(56, 189, 248, 0.1) !important;
            border-top: 1px solid rgba(56, 189, 248, 0.05) !important;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3) !important;
        }

        #currentRepo, .modal-title-text {
            background: linear-gradient(to right, #38bdf8, #818cf8, #c084fc) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            color: transparent !important;
            font-weight: 800 !important;
            letter-spacing: 0.5px !important;
            text-shadow: 0 0 20px rgba(56, 189, 248, 0.3) !important;
        }

        .header-left i {
            color: #38bdf8 !important;
            filter: drop-shadow(0 0 5px rgba(56, 189, 248, 0.6));
        }

        .file-item {
            background: linear-gradient(90deg, rgba(30, 41, 59, 0.4) 0%, rgba(30, 41, 59, 0.1) 100%) !important;
            border: 1px solid rgba(99, 102, 241, 0.2) !important;
            border-left: 2px solid rgba(99, 102, 241, 0.5) !important;
            border-radius: 6px !important;
            margin-bottom: 6px !important;
            transition: all 0.2s ease-out !important;
        }

        .file-item:hover {
            transform: translateX(4px) !important;
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%) !important;
            border-color: #38bdf8 !important;
            box-shadow: 0 0 15px rgba(56, 189, 248, 0.1) !important;
        }

        .file-name {
            color: #f0f9ff !important;
            font-weight: 600 !important;
            text-shadow: 0 0 1px rgba(255,255,255,0.1) !important;
        }

        .file-meta, .repo-description {
            color: var(--cyber-text-sub) !important;
            font-size: 0.75rem !important;
            opacity: 0.85 !important;
        }

        .file-icon i, .fa-folder {
            filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4)) !important;
        }

        .modal-form-container, .modal-content, .context-menu-item, #contextMenu, .custom-dropdown, #mainMenuPopup {
            background: rgba(13, 18, 36, 0.92) !important;
            backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(56, 189, 248, 0.2) !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(99, 102, 241, 0.05) !important;
            border-radius: 12px !important;
            color: var(--cyber-text-main) !important;
        }

        h3, h4, h5, label {
            color: #e2e8f0 !important;
        }

        p {
            color: #cbd5e1 !important;
        }

        input, textarea, select {
            background: rgba(2, 6, 23, 0.6) !important;
            border: 1px solid rgba(99, 102, 241, 0.3) !important;
            border-radius: 6px !important;
            color: #fff !important;
            font-family: monospace !important;
            transition: all 0.3s !important;
        }

        input::placeholder, textarea::placeholder {
            color: #64748b !important;
        }

        input:focus, textarea:focus, select:focus {
            border-color: #38bdf8 !important;
            box-shadow: 0 0 10px rgba(56, 189, 248, 0.2), inset 0 0 5px rgba(56, 189, 248, 0.1) !important;
            background: rgba(2, 6, 23, 0.8) !important;
        }

        .btn, button {
            border-radius: 6px !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px !important;
            transition: all 0.3s !important;
            text-transform: none !important;
        }

        .btn-primary, #authBtn, .btn-primary-action {
            background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%) !important;
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            color: #fff !important;
        }

        .btn-primary:hover, #authBtn:hover {
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.6) !important;
            border-color: #38bdf8 !important;
        }

        .btn-danger {
            background: linear-gradient(135deg, #be123c 0%, #e11d48 100%) !important;
            color: #ffe4e6 !important;
            border: 1px solid rgba(255, 60, 60, 0.2) !important;
        }

        #sideNav {
            background: rgba(10, 14, 28, 0.95) !important;
            border-right: 1px solid rgba(56, 189, 248, 0.1) !important;
        }

        #sideNav li a {
            color: #94a3b8 !important;
            border-radius: 6px !important;
            margin: 4px 10px !important;
        }

        #sideNav li a:hover {
            background: rgba(56, 189, 248, 0.1) !important;
            color: #38bdf8 !important;
            text-shadow: 0 0 8px rgba(56, 189, 248, 0.4) !important;
        }

        #sideNav li a i {
            color: #6366f1 !important;
        }

        .effect-item {
            background: rgba(30, 41, 59, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        
        .effect-item.active {
            background: rgba(56, 189, 248, 0.1) !important;
            border-color: #38bdf8 !important;
        }
        
        .effect-name {
            color: #f1f5f9 !important;
        }

        .modern-card {
            background: rgba(15, 23, 42, 0.95) !important;
            border: 1px solid rgba(56, 189, 248, 0.2) !important;
        }

        #multi-select-bar {
            background: rgba(15, 23, 42, 0.95) !important;
            border: 1px solid #38bdf8 !important;
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.2) !important;
            color: #fff !important;
        }
        
        #multi-select-bar .action-btn {
            color: #94a3b8 !important;
        }
        
        #multi-select-bar .action-btn:hover {
            color: #38bdf8 !important;
            background: rgba(56, 189, 248, 0.1) !important;
        }

        .select-checkbox-bg {
            border-color: #38bdf8 !important;
            background: rgba(0,0,0,0.3) !important;
        }

        .file-item.selected {
            background: rgba(56, 189, 248, 0.1) !important;
            border-color: #38bdf8 !important;
            box-shadow: 0 0 10px rgba(56, 189, 248, 0.2) !important;
        }

        .file-item.selected .select-checkbox-bg {
            background: #38bdf8 !important;
            box-shadow: 0 0 10px #38bdf8 !important;
        }
        
        i {
            transition: color 0.3s, text-shadow 0.3s !important;
        }
        
        .empty-state, .publish-list-empty {
            color: #64748b !important;
        }
        
        .empty-state i {
            color: #334155 !important;
            filter: drop-shadow(0 0 0 transparent) !important;
        }
    `;
    document.head.appendChild(style);
})();