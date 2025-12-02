(function() {
    const P = window.parent;
    const Doc = P.document;
    const ID = 'repo-mindmap-pro';

    if (Doc.getElementById(ID)) return;

    const css = `
        #${ID}-fab {
            position: fixed; bottom: 180px; right: 20px;
            width: 48px; height: 48px; border-radius: 50%;
            background: #6366f1; color: #fff;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.5);
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; cursor: pointer; z-index: 2147483646;
            border: 2px solid rgba(255,255,255,0.2); transition: transform 0.2s;
        }
        #${ID}-fab:active { transform: scale(0.9); }
        #${ID}-box {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.95); z-index: 2147483647;
            display: flex; flex-direction: column; opacity: 0; pointer-events: none;
            transition: opacity 0.2s; backdrop-filter: blur(8px);
        }
        #${ID}-box.active { opacity: 1; pointer-events: auto; }
        .mm-head {
            height: 56px; border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 20px; background: rgba(30, 41, 59, 0.4);
        }
        .mm-tit { font-weight: 600; color: #fff; font-size: 16px; }
        .mm-close { font-size: 20px; color: #94a3b8; background: none; border: none; cursor: pointer; }
        .mm-body { flex: 1; overflow: auto; padding: 20px; }
        .mm-node { margin-left: 20px; border-left: 1px solid rgba(255,255,255,0.1); }
        .mm-row {
            display: flex; align-items: center; padding: 6px 10px; cursor: pointer;
            color: #cbd5e1; font-size: 14px; font-family: monospace; border-radius: 6px;
        }
        .mm-row:active { background: rgba(255,255,255,0.1); }
        .mm-icon { width: 20px; text-align: center; margin-right: 8px; font-size: 14px; }
        .mm-f-icon { color: #fbbf24; }
        .mm-doc-icon { color: #60a5fa; }
        .mm-media-icon { color: #34d399; }
        .mm-sub { display: none; }
        .mm-open > .mm-sub { display: block; }
        .mm-arrow { width: 12px; font-size: 10px; color: #64748b; transition: transform 0.2s; display: inline-block; }
        .mm-open > .mm-row .mm-arrow { transform: rotate(90deg); }
        
        body.light-theme #${ID}-box { background: rgba(255, 255, 255, 0.98); }
        body.light-theme .mm-head { border-bottom-color: #e2e8f0; background: #f8fafc; }
        body.light-theme .mm-tit { color: #0f172a; }
        body.light-theme .mm-row { color: #334155; }
        body.light-theme .mm-node { border-left-color: #e2e8f0; }
        body.light-theme .mm-row:active { background: #f1f5f9; }
    `;

    const styleEl = Doc.createElement('style');
    styleEl.innerHTML = css;
    Doc.head.appendChild(styleEl);

    const fab = Doc.createElement('div');
    fab.id = `${ID}-fab`;
    fab.innerHTML = '<i class="fa-solid fa-sitemap"></i>';
    Doc.body.appendChild(fab);

    const modal = Doc.createElement('div');
    modal.id = `${ID}-box`;
    modal.innerHTML = `
        <div class="mm-head">
            <span class="mm-tit">仓库结构</span>
            <button class="mm-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="mm-body" id="mm-content"></div>
    `;
    Doc.body.appendChild(modal);

    const content = modal.querySelector('#mm-content');
    const closeBtn = modal.querySelector('.mm-close');

    function makeTree(paths) {
        const root = {};
        paths.forEach(p => {
            const parts = p.path.split('/');
            let cur = root;
            parts.forEach((part, i) => {
                if (!cur[part]) {
                    cur[part] = (i === parts.length - 1) ? { _f: true, path: p.path } : {};
                }
                cur = cur[part];
            });
        });
        return root;
    }

    function renderIcon(name, isFile) {
        if (!isFile) return '<i class="fa-solid fa-folder mm-icon mm-f-icon"></i>';
        const ext = name.split('.').pop().toLowerCase();
        if (['jpg','png','mp4','mp3'].includes(ext)) return '<i class="fa-solid fa-image mm-icon mm-media-icon"></i>';
        return '<i class="fa-regular fa-file-lines mm-icon mm-doc-icon"></i>';
    }

    function renderTree(name, data, parent) {
        const wrap = Doc.createElement('div');
        wrap.className = 'mm-node';
        const isFile = data._f;
        
        if (!isFile) wrap.classList.add('mm-open');

        const row = Doc.createElement('div');
        row.className = 'mm-row';
        row.innerHTML = `
            <span class="mm-arrow">${isFile ? '' : '▶'}</span>
            ${renderIcon(name, isFile)}
            <span>${name}</span>
        `;

        row.onclick = (e) => {
            e.stopPropagation();
            if (isFile) {
                modal.classList.remove('active');
                if (typeof P.navigateToPath === 'function') {
                    const full = data.path;
                    const dir = full.substring(0, full.lastIndexOf('/'));
                    const path = dir ? dir + '/' : '';
                    
                    P.navigateToPath(path);
                    if(typeof P.showToast === 'function') P.showToast('已跳转: ' + name);
                }
            } else {
                wrap.classList.toggle('mm-open');
            }
        };

        wrap.appendChild(row);

        if (!isFile) {
            const sub = Doc.createElement('div');
            sub.className = 'mm-sub';
            const keys = Object.keys(data).sort((a, b) => {
                const af = data[a]._f;
                const bf = data[b]._f;
                if (af === bf) return a.localeCompare(b);
                return af ? 1 : -1;
            });
            keys.forEach(k => renderTree(k, data[k], sub));
            wrap.appendChild(sub);
        }
        parent.appendChild(wrap);
    }

    fab.onclick = () => {
        const cache = P.state.repoTreeCache;
        content.innerHTML = '';
        
        if (!cache || cache.length === 0) {
            content.innerHTML = '<div style="text-align:center;color:#64748b;margin-top:40px">需先进入任意仓库并加载完成</div>';
        } else {
            const tree = makeTree(cache);
            Object.keys(tree).forEach(k => renderTree(k, tree[k], content));
        }
        modal.classList.add('active');
    };

    closeBtn.onclick = () => modal.classList.remove('active');
})();