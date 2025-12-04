(function() {
    const styleId = 'cloud-theme-cyber-aurora';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        :root {
            --cyber-bg: #0b1021;
            --cyber-card: rgba(30, 41, 59, 0.4);
            --cyber-border: rgba(99, 102, 241, 0.3);
            --cyber-accent: #6366f1;
            --cyber-glow: #818cf8;
            --cyber-text: #e2e8f0;
            --cyber-highlight: #38bdf8;
        }

        body {
            background: radial-gradient(circle at top right, #1e1b4b 0%, #0f172a 100%) !important;
            color: var(--cyber-text) !important;
        }

        ::-webkit-scrollbar {
            width: 6px !important;
            height: 6px !important;
            background: transparent !important;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(99, 102, 241, 0.3) !important;
            border-radius: 3px !important;
        }
        ::-webkit-scrollbar-track {
            background: transparent !important;
        }

        header, footer, #toolbar {
            background: rgba(15, 23, 42, 0.6) !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
            border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
        }

        #currentRepo {
            color: var(--cyber-highlight) !important;
            text-shadow: 0 0 10px rgba(56, 189, 248, 0.3) !important;
            font-weight: 800 !important;
            letter-spacing: 0.5px !important;
        }

        .file-item {
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%) !important;
            border: 1px solid var(--cyber-border) !important;
            border-radius: 8px !important;
            margin-bottom: 8px !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .file-item:hover {
            transform: translateY(-2px) !important;
            background: rgba(99, 102, 241, 0.1) !important;
            border-color: var(--cyber-accent) !important;
            box-shadow: 0 5px 15px rgba(99, 102, 241, 0.2) !important;
        }

        .file-name {
            color: #f1f5f9 !important;
            font-weight: 500 !important;
        }

        .file-icon i, .fa-folder {
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3)) !important;
        }

        .modal-form-container, .modal-content, .context-menu-item, #contextMenu, .custom-dropdown, #mainMenuPopup {
            background: rgba(15, 23, 42, 0.9) !important;
            backdrop-filter: blur(25px) !important;
            border: 1px solid rgba(139, 92, 246, 0.2) !important;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
            border-radius: 16px !important;
            color: #fff !important;
        }

        input, textarea, select {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px !important;
            color: #fff !important;
            transition: border-color 0.3s !important;
        }

        input:focus, textarea:focus, select:focus {
            border-color: var(--cyber-highlight) !important;
            box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2) !important;
            background: rgba(0, 0, 0, 0.5) !important;
        }

        .btn, button {
            border-radius: 8px !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            transition: all 0.3s !important;
        }

        .btn-primary, #authBtn {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4) !important;
            border: none !important;
            color: white !important;
        }

        .btn-primary:hover, #authBtn:hover {
            box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6) !important;
            transform: translateY(-1px) !important;
        }

        .btn-danger {
            background: linear-gradient(135deg, #ef4444 0%, #f43f5e 100%) !important;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4) !important;
        }

        #sideNav {
            background: rgba(11, 16, 33, 0.95) !important;
            border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
        }

        #sideNav li a {
            color: #cbd5e1 !important;
            border-radius: 8px !important;
            transition: all 0.2s !important;
        }

        #sideNav li a:hover {
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.1), transparent) !important;
            color: var(--cyber-highlight) !important;
            padding-left: 25px !important; 
        }

        #sideNav li a i {
            color: var(--cyber-accent) !important;
        }

        .effect-item {
            background: rgba(255, 255, 255, 0.03) !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        
        .effect-item.active {
            background: rgba(99, 102, 241, 0.15) !important;
            border-color: var(--cyber-accent) !important;
        }

        .modern-card {
            background: rgba(15, 23, 42, 0.95) !important;
            border: 1px solid rgba(139, 92, 246, 0.3) !important;
        }

        #multi-select-bar {
            background: rgba(15, 23, 42, 0.9) !important;
            backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(99, 102, 241, 0.3) !important;
            box-shadow: 0 -5px 20px rgba(0,0,0,0.3) !important;
            border-radius: 16px !important;
        }

        .select-checkbox-bg {
            border-color: var(--cyber-highlight) !important;
            background: transparent !important;
        }

        .file-item.selected {
            background: rgba(56, 189, 248, 0.15) !important;
            border-color: var(--cyber-highlight) !important;
        }

        .file-item.selected .select-checkbox-bg {
            background: var(--cyber-highlight) !important;
        }
        
        i {
            transition: color 0.3s !important;
        }
    `;
    document.head.appendChild(style);
})();