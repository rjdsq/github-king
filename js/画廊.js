(function() {
    const P = window.parent;
    const Doc = P.document;
    const ID = 'cloud-gallery-plugin';
    
    if (Doc.getElementById(ID)) return;

    const STATE = {
        images: [],
        index: 0,
        active: false
    };

    const EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];

    const css = `
        #${ID} {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #000; z-index: 2147483648;
            display: flex; flex-direction: column;
            opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        #${ID}.active { opacity: 1; pointer-events: auto; }
        #${ID} .cg-header {
            position: absolute; top: 0; left: 0; width: 100%;
            padding: 15px 20px;
            background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
            display: flex; justify-content: space-between; align-items: center;
            z-index: 2;
        }
        .cg-title { color: #fff; font-size: 14px; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
        .cg-count { color: #9ca3af; font-size: 12px; }
        .cg-close {
            background: rgba(255,255,255,0.1); border: none; color: #fff;
            width: 32px; height: 32px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        #${ID} .cg-stage {
            flex: 1; position: relative; display: flex; align-items: center; justify-content: center;
            overflow: hidden; touch-action: none;
        }
        .cg-img {
            max-width: 100%; max-height: 100%; object-fit: contain;
            transition: transform 0.2s ease; user-select: none;
        }
        .cg-loader {
            position: absolute; width: 40px; height: 40px;
            border: 3px solid rgba(255,255,255,0.1); border-top-color: #fff;
            border-radius: 50%; animation: spin 1s linear infinite;
        }
        .cg-nav {
            position: absolute; top: 50%; transform: translateY(-50%);
            width: 50px; height: 100px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            color: rgba(255,255,255,0.5); font-size: 24px; transition: 0.2s;
            z-index: 2;
        }
        .cg-nav:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .cg-prev { left: 0; }
        .cg-next { right: 0; }
        .cg-toolbar {
            position: absolute; bottom: 0; left: 0; width: 100%;
            padding: 20px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            display: flex; justify-content: center; gap: 20px; z-index: 2;
        }
        .cg-btn {
            background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
            color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 12px;
            cursor: pointer; backdrop-filter: blur(4px);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
    `;

    const styleEl = Doc.createElement('style');
    styleEl.innerHTML = css;
    Doc.head.appendChild(styleEl);

    const container = Doc.createElement('div');
    container.id = ID;
    container.innerHTML = `
        <div class="cg-header">
            <div>
                <div class="cg-title">Loading...</div>
                <div class="cg-count">0 / 0</div>
            </div>
            <button class="cg-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="cg-stage">
            <div class="cg-loader"></div>
            <img class="cg-img" src="" alt="">
            <div class="cg-nav cg-prev"><i class="fa-solid fa-chevron-left"></i></div>
            <div class="cg-nav cg-next"><i class="fa-solid fa-chevron-right"></i></div>
        </div>
        <div class="cg-toolbar">
            <button class="cg-btn" id="cg-dl">下载原图</button>
            <button class="cg-btn" id="cg-copy">复制链接</button>
        </div>
    `;
    Doc.body.appendChild(container);

    const els = {
        title: container.querySelector('.cg-title'),
        count: container.querySelector('.cg-count'),
        img: container.querySelector('.cg-img'),
        loader: container.querySelector('.cg-loader'),
        close: container.querySelector('.cg-close'),
        prev: container.querySelector('.cg-prev'),
        next: container.querySelector('.cg-next'),
        dl: container.querySelector('#cg-dl'),
        copy: container.querySelector('#cg-copy')
    };

    function scanImages() {
        const tree = P.state.repoTreeCache || P.state.files || [];
        STATE.images = tree.filter(f => {
            const ext = (f.name || f.path).split('.').pop().toLowerCase();
            return EXTS.includes(ext) && f.type !== 'tree';
        }).map(f => ({
            name: f.name || f.path.split('/').pop(),
            path: f.path,
            url: ''
        }));
    }

    function loadImage(index) {
        if (!STATE.images[index]) return;
        STATE.index = index;
        const item = STATE.images[index];
        
        els.title.textContent = item.name;
        els.count.textContent = `${index + 1} / ${STATE.images.length}`;
        els.loader.style.display = 'block';
        els.img.style.opacity = '0';

        const repo = P.state.currentRepo;
        const branch = P.state.currentBranch;
        const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${item.path}`;
        const proxyUrl = P.getProxiedUrl ? P.getProxiedUrl(rawUrl) : rawUrl;
        
        item.url = proxyUrl;

        const tmpImg = new Image();
        tmpImg.src = proxyUrl;
        tmpImg.onload = () => {
            els.img.src = proxyUrl;
            els.img.style.opacity = '1';
            els.loader.style.display = 'none';
        };
        tmpImg.onerror = () => {
            els.loader.style.display = 'none';
            P.showToast('图片加载失败');
        };
    }

    function openGallery(fileName) {
        scanImages();
        const idx = STATE.images.findIndex(i => i.name === fileName || i.path.endsWith(fileName));
        STATE.active = true;
        container.classList.add('active');
        loadImage(idx !== -1 ? idx : 0);
    }

    function closeGallery() {
        STATE.active = false;
        container.classList.remove('active');
        els.img.src = '';
    }

    function prev() {
        let newIndex = STATE.index - 1;
        if (newIndex < 0) newIndex = STATE.images.length - 1;
        loadImage(newIndex);
    }

    function next() {
        let newIndex = STATE.index + 1;
        if (newIndex >= STATE.images.length) newIndex = 0;
        loadImage(newIndex);
    }

    els.close.onclick = closeGallery;
    els.prev.onclick = (e) => { e.stopPropagation(); prev(); };
    els.next.onclick = (e) => { e.stopPropagation(); next(); };
    
    els.dl.onclick = (e) => {
        e.stopPropagation();
        const item = STATE.images[STATE.index];
        const a = Doc.createElement('a');
        a.href = item.url;
        a.download = item.name;
        Doc.body.appendChild(a);
        a.click();
        Doc.body.removeChild(a);
    };

    els.copy.onclick = (e) => {
        e.stopPropagation();
        const item = STATE.images[STATE.index];
        navigator.clipboard.writeText(item.url).then(() => P.showToast('链接已复制'));
    };

    Doc.addEventListener('keydown', (e) => {
        if (!STATE.active) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    const fileListEl = Doc.getElementById('fileList');
    if (fileListEl) {
        fileListEl.addEventListener('click', (e) => {
            const item = e.target.closest('.file-item');
            if (!item) return;
            const nameEl = item.querySelector('.file-name');
            if (!nameEl) return;
            const name = nameEl.textContent.trim();
            const ext = name.split('.').pop().toLowerCase();
            if (EXTS.includes(ext)) {
                e.preventDefault();
                e.stopPropagation();
                openGallery(name);
            }
        }, true);
    }
})();