(function() {
    const styleId = 'neon-ui-global-fx';
    if (document.getElementById(styleId)) return;

    const css = `
        body, 
        .file-name, 
        .repo-name, 
        h1, h2, h3, h4, h5, h6, 
        span, 
        i, 
        button, 
        a {
            text-shadow: 0 0 2px rgba(0, 255, 255, 0.5) !important;
            transition: all 0.3s ease;
        }

        .auth-header h1, 
        #currentRepo {
            color: #fff !important;
            text-shadow: 
                0 0 5px #fff,
                0 0 10px #ff00de,
                0 0 20px #ff00de,
                0 0 40px #ff00de !important;
        }

        .file-item {
            background-color: rgba(0, 10, 20, 0.8) !important;
            border: 1px solid #00f3ff !important;
            box-shadow: 0 0 5px #00f3ff, inset 0 0 5px rgba(0, 243, 255, 0.2) !important;
        }

        .file-name, .repo-name {
            color: #0aff0a !important;
            font-family: 'Courier New', monospace !important;
            font-weight: bold !important;
            text-shadow: 0 0 5px #0aff0a !important;
        }

        .file-icon i {
            color: #00f3ff !important;
            filter: drop-shadow(0 0 5px #00f3ff) !important;
        }

        .file-icon i.fa-folder {
            color: #ffd700 !important;
            filter: drop-shadow(0 0 5px #ffd700) !important;
        }

        button, .btn {
            border: 1px solid #ff00de !important;
            color: #ff00de !important;
            background: transparent !important;
            box-shadow: 0 0 5px #ff00de !important;
            text-shadow: 0 0 3px #ff00de !important;
        }

        button:hover, .btn:hover {
            background-color: rgba(255, 0, 222, 0.2) !important;
            box-shadow: 0 0 15px #ff00de !important;
        }

        #fileList.grid .file-item {
            background: rgba(0, 0, 0, 0.7) !important;
            border: 1px solid #0aff0a !important;
            box-shadow: 0 0 8px #0aff0a !important;
        }

        header, footer, #toolbar, #sideNav, .modal-form-container {
            background: rgba(5, 5, 10, 0.95) !important;
            border-color: #00f3ff !important;
            box-shadow: 0 0 10px rgba(0, 243, 255, 0.3) !important;
        }

        #editModal .modal-content,
        #editModal .modal-header,
        #editModal .modal-footer,
        #fileContent,
        .editor-container * {
            text-shadow: none !important;
            box-shadow: none !important;
            filter: none !important;
            color: inherit;
        }

        #fileContent {
            color: #c0c0c0 !important;
            background-color: #030712 !important;
            border: 1px solid #374151 !important; 
            font-family: monospace !important;
        }
        
        #editModal .modal-header h5 {
            text-shadow: none !important;
            color: #e0e7ff !important;
        }
    `;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);

    if (typeof showToast === 'function') {
        showToast('Neon Mode Activated');
    }
})();