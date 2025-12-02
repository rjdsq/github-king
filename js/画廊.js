(function() {
    const P = window.parent;
    const Doc = P.document;
    const ID = 'cloud-gallery-pro';
    
    if (Doc.getElementById(ID)) return;

    const STATE = {
        list: [],
        idx: 0,
        active: false
    };

    const EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];

    const css = `
        #${ID} {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #000; z-index: 2147483647;
            display: flex; flex-direction: column;
            opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
        }
        #${ID}.active { opacity: 1; pointer-events: auto; }
        .cg-head {
            position: absolute; top: 0; left: 0; width: 100%; height: 60px;
            background: linear-gradient(180deg, rgba(0,0,0,0.8), transparent);
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 20px; z-index: 10;
        }
        .cg-info { color: #fff; font-size: 14px; text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
        .cg-idx { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .cg-close {
            width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15);
            border: none; color: #fff; display: flex; align-items: center; justify-content: center;
            font-size: 18px; cursor: pointer; backdrop-filter: blur(4px);
        }
        .cg-body {
            flex: 1; position: relative; display: flex; align-items: center; justify-content: center;
            overflow: hidden;
        }
        .cg-img {
            max-width: 100%; max-height: 100%; object-fit: contain;
            transform: scale(1); transition: transform 0.2s;
        }
        .cg-loading {
            position: absolute; width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.2);
            border-top-color: #fff; border-radius: 50%; animation: cgSpin 0.8s linear infinite;
        }
        .cg-nav {
            position: absolute; top: 50%; transform: translateY(-50%);
            width: 60px; height: 100px; display: flex; align-items: center; justify-content: center;
            font-size: 30px; color: rgba(255,255,255,0.4); cursor: pointer; z-index: 5;
        }
        .cg-nav:active { color: #fff; background: rgba(0,0,0,0.2); }
        .cg-prev { left: 0; }
        .cg-next { right: 0; }
        .cg-foot {
            position: absolute; bottom: 0; left: 0; width: 100%; height: 80px;
            background: linear-gradient(0deg, rgba(0,0,0,0.8), transparent);
            display: flex; justify-content: center; align-items: center; gap: 20px; z-index: 10;
        }
        .cg-btn {
            padding: 8px 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.1); color: #fff; font-size: 13px;
            cursor: pointer; backdrop-filter: blur(4px);
        }
        @keyframes cgSpin { to { transform: rotate(360deg); } }
    `;

    const styleEl = Doc.createElement('style');
    styleEl.innerHTML = css;
    Doc.head.appendChild(styleEl);

    const el = Doc.createElement('div');
    el.id = ID;
    el.innerHTML = `
        <div class="cg-head">
            <div>
                <div class="cg-info" id="cg-name"></div>
                <div class="cg-idx" id="cg-count"></div>
            </div>
            <button class="cg-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="cg-body">
            <div class="cg-loading"></div>
            <img class="cg-img" src="" draggable="false">
            <div class="cg-nav cg-prev"><i class="fa-solid fa-chevron-left"></i></div>
            <div class="cg-nav cg-next"><i class="fa-solid fa-chevron-right"></i></div>
        </div>
        <div class="cg-foot">
            <button class="cg-btn" id="cg-dl">下载</button>
            <button class="cg-btn" id="cg-cp">复制链接</button>
        </div>
    `;
    Doc.body.appendChild(el);

    const ui = {
        name: el.querySelector('#cg-name'),
        count: el.querySelector('#cg-count'),
        img: el.querySelector('.cg-img'),
        load: el.querySelector('.cg-loading'),
        close: el.querySelector('.cg-close'),
        prev: el.querySelector('.cg-prev'),
        next: el.querySelector('.cg-next'),
        dl: el.querySelector('#cg-dl'),
        cp: el.querySelector('#cg-cp')
    };

    function getProxy(url) {
        return P.getProxiedUrl ? P.getProxiedUrl(url) : url;
    }

    function refreshData() {
        let src = P.state.repoTreeCache;
        if (!src || !Array.isArray(src) || src.length === 0) {
            src = P.state.files || [];
        }
        STATE.list = src.filter(f => {
            const n = f.name || f.path.split('/').pop();
            return EXTS.includes(n.split('.').pop().toLowerCase()) && f.type !== 'tree';
        }).map(f => ({
            name: f.name || f.path.split('/').pop(),
            path: f.path,
            url: '' 
        }));
    }

    function showImg(idx) {
        if (!STATE.list[idx]) return;
        STATE.idx = idx;
        const item = STATE.list[idx];
        
        ui.name.textContent = item.name;
        ui.count.textContent = `${idx + 1} / ${STATE.list.length}`;
        ui.load.style.display = 'block';
        ui.img.style.opacity = '0';
        ui.img.style.transform = 'scale(1)';

        const r = P.state.currentRepo;
        const b = P.state.currentBranch;
        const raw = `https://raw.githubusercontent.com/${r}/${b}/${item.path}`;
        const url = getProxy(raw);
        item.url = url;

        const i = new Image();
        i.src = url;
        i.onload = () => {
            ui.img.src = url;
            ui.img.style.opacity = '1';
            ui.load.style.display = 'none';
        };
        i.onerror = () => {
            ui.load.style.display = 'none';
            if(typeof P.showToast === 'function') P.showToast('图片加载失败');
        };
    }

    function open(name) {
        refreshData();
        if (STATE.list.length === 0) return;
        
        let target = STATE.list.findIndex(i => i.name === name || i.path.endsWith(name));
        if (target === -1) target = 0;
        
        STATE.active = true;
        el.classList.add('active');
        showImg(target);
    }

    function close() {
        STATE.active = false;
        el.classList.remove('active');
        setTimeout(() => { ui.img.src = ''; }, 200);
    }

    function switchImg(dir) {
        let n = STATE.idx + dir;
        if (n < 0) n = STATE.list.length - 1;
        if (n >= STATE.list.length) n = 0;
        showImg(n);
    }

    ui.close.onclick = close;
    ui.prev.onclick = (e) => { e.stopPropagation(); switchImg(-1); };
    ui.next.onclick = (e) => { e.stopPropagation(); switchImg(1); };
    
    ui.dl.onclick = (e) => {
        e.stopPropagation();
        const item = STATE.list[STATE.idx];
        const a = Doc.createElement('a');
        a.href = item.url;
        a.download = item.name;
        Doc.body.appendChild(a);
        a.click();
        Doc.body.removeChild(a);
    };

    ui.cp.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(STATE.list[STATE.idx].url).then(() => {
            if(typeof P.showToast === 'function') P.showToast('链接已复制');
        });
    };

    el.onclick = close;
    ui.img.onclick = (e) => e.stopPropagation();

    Doc.addEventListener('click', (e) => {
        const item = e.target.closest('.file-item');
        if (!item) return;
        
        const nameNode = item.querySelector('.file-name');
        if (!nameNode) return;
        
        const name = nameNode.textContent.trim();
        const ext = name.split('.').pop().toLowerCase();
        
        if (EXTS.includes(ext)) {
            e.preventDefault();
            e.stopPropagation();
            open(name);
        }
    }, true); 

})();