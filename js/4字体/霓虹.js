(function() {
    const styleId = 'cloud-plugin-neon-text';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        body, body * {
            color: #e0e7ff !important;
            text-shadow: 
                0 0 2px #fff,
                0 0 5px #a855f7,
                0 0 10px #8b5cf6, 
                0 0 20px #6366f1,
                0 0 35px #4f46e5 !important;
            transition: text-shadow 0.3s ease, color 0.3s ease;
        }
        
        input::placeholder, textarea::placeholder {
            color: #818cf8 !important;
            text-shadow: none !important;
            opacity: 0.7;
        }

        .fa, .fas, .far, .fab {
            text-shadow: 
                0 0 5px #fff, 
                0 0 10px #d946ef, 
                0 0 20px #a855f7 !important;
        }
    `;
    document.head.appendChild(style);
})();