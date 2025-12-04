(function() {
    const styleId = 'cloud-plugin-rainbow-text';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        @keyframes rainbow-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        body, div, span, p, h1, h2, h3, h4, h5, h6, a, i, b, strong, em, small, li, button, label, .file-name {
            background-image: linear-gradient(125deg, #ff0000, #ff7f00, #ffff00, #00ff00, #00ffff, #0000ff, #8b00ff, #ff0000);
            background-size: 300% 300%;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
            animation: rainbow-flow 6s linear infinite;
        }

        .ace_editor, .ace_editor *, 
        #fileContent, 
        textarea, input, 
        code, pre {
            background-image: none !important;
            -webkit-background-clip: border-box !important;
            background-clip: border-box !important;
            -webkit-text-fill-color: initial !important;
            color: inherit !important;
            animation: none !important;
        }

        ::placeholder {
            -webkit-text-fill-color: #6b7280 !important;
            color: #6b7280 !important;
            opacity: 0.6;
        }
    `;
    document.body.appendChild(style);
})();