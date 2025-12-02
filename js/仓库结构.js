(function() {
    const P = window.parent;
    const Doc = P.document;
    const ID = 'repo-mindmap-plugin';

    if (Doc.getElementById(ID)) return;

    const style = Doc.createElement('style');
    style.innerHTML = `
        #${ID}-fab {
            position: fixed; bottom: 180px; right: 20px;
            width: 44px; height: 44px; border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 2147483646; color: #fff;
            transition: transform 0.2s; border: 2px solid rgba(255,255,255,0.2);
        }
        #${ID}-fab:active { transform: scale(0.9); }
        #${ID}-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.95); z-index: 2147483647;
            display: flex; flex-direction: column; opacity: 0; pointer-events: none;
            transition: opacity 0.3s; backdrop-filter: blur(5px);
        }
        #${ID}-modal.active { opacity: 1; pointer-events: auto; }
        .rm-header {
            padding: 15px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-between; align-items: center;
            background: rgba(30, 41, 59, 0.5);
        }
        .rm-title { color: #fff; font-weight: 600; font-size: 16px; }
        .rm-close { background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; }
        .rm-body { flex: 1; overflow: auto; padding: 20px; }
        
        .rm-tree { font-family: monospace; font-size: 14px; line-height: 1.8; color: #e2e8f0; }
        .rm-node { padding-left: 20px; position: relative; }
        .rm-node::before {
            content: ''; position: absolute; left: 0; top: 0; bottom: 0;
            width: 1px; background: rgba(255,255,255,0.15);
        }
        .rm-item {
            display: flex; align-items: center; gap: 8px; cursor: pointer;
            padding: 4px 8px; border-radius: 4px; transition: background 0.1s;
        }
        .rm-item:hover { background: rgba(255,255,255,0.1); }
        .rm-icon { width: 16px; text-align: center; font-size: 12px; }
        .rm-icon.folder { color: #fbbf24; }
        .rm-icon.file { color: #94a3b8; }
        .rm-icon.code { color: #60a5fa; }
        .rm-icon.media { color: #34d399; }
        .rm-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rm-children { display: none; margin-left: 8px; }
        .rm-node.expanded > .rm-children { display: block; }
        .rm-arrow { 
            font-size: 10px; color: #64748b; width: 12px; display: inline-block; transition: transform 0.2s;
        }
        .rm-node.expanded > .rm-item > .rm-arrow { transform: rotate(90deg); }
        
        body.light-theme #${ID}-modal { background: rgba(255, 255, 255, 0.98); }
        body.light-theme .rm-header { background: #f1f5f9; border-bottom-color: #e2e8f0; }
        body.light-theme .rm-title { color: #0f172a; }
        body.light-theme .rm-tree { color: #334155; }
        body.light-theme .rm-node::before { background: #cbd5e1; }
        body.light-theme .rm-item:hover { background: #e2e8f0; }
    `;
    Doc.head.appendChild(style);

    const fab = Doc.createElement('div');
    fab.id = `${ID}-fab`;
    fab.innerHTML = '<i class="fa-solid fa-sitemap"></i>';
    fab.title = '仓库结构图';
    Doc.body.appendChild(fab);

    const modal = Doc.createElement('div');
    modal.id = `${ID}-modal`;
    modal.innerHTML = `
        <div class="rm-header">
            <div class="rm-title">仓库结构概览</div>
            <button class="rm-close"><i class="fa-solid fa-times"></i></button>
        </div>
        <div class="rm-body"><div class="rm-tree" id="rm-content"></div></div>
    `;
    Doc.body.appendChild(modal);

    const contentEl = modal.querySelector('#rm-content');
    const closeBtn = modal.querySelector('.rm-close');

    function buildTree(paths) {
        const root = {};
        paths.forEach(p => {
            const parts = p.path.split('/');
            let current = root;
            parts.forEach((part, i) => {
                if (!current[part]) {
                    current[part] = (i === parts.length - 1) ? { __file: true, path: p.path } : {};
                }
                current = current[part];
            });
        });
        return root;
    }

    function getIcon(name, isFile) {
        if (!isFile) return '<i class="fa-solid fa-folder rm-icon folder"></i>';
        const ext = name.split('.').pop().toLowerCase();
        if (['js','html','css','json','py','java','c','cpp'].includes(ext)) return '<i class="fa-solid fa-code rm-icon code"></i>';
        if (['jpg','png','gif','mp4','mp3'].includes(ext)) return '<i class="fa-solid fa-photo-film rm-icon media"></i>';
        return '<i class="fa-regular fa-file rm-icon file"></i>';
    }

    function renderNode(name, data, container) {
        const node = Doc.createElement('div');
        node.className = 'rm-node';
        const isFile = data.__file;
        const hasChildren = !isFile && Object.keys(data).length > 0;
        
        // Default expand top levels, collapse deeper ones
        if (!isFile) node.classList.add('expanded');

        const item = Doc.createElement('div');
        item.className = 'rm-item';
        item.innerHTML = `
            ${hasChildren ? '<span class="rm-arrow">▶</span>' : '<span class="rm-arrow" style="opacity:0">▶</span>'}
            ${getIcon(name, isFile)}
            <span class="rm-label">${name}</span>
        `;
        
        item.onclick = (e) => {
            e.stopPropagation();
            if (isFile) {
                const fullPath = data.path;
                const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
                P.navigateToPath(dir + '/');
                modal.classList.remove('active');
                P.showToast(`跳转至: ${name}`);
            } else {
                node.classList.toggle('expanded');
            }
        };

        node.appendChild(item);

        if (hasChildren) {
            const childrenContainer = Doc.createElement('div');
            childrenContainer.className = 'rm-children';
            Object.keys(data).sort((a,b) => {
                const aIsFile = data[a].__file;
                const bIsFile = data[b].__file;
                if(aIsFile === bIsFile) return a.localeCompare(b);
                return aIsFile ? 1 : -1;
            }).forEach(key => {
                renderNode(key, data[key], childrenContainer);
            });
            node.appendChild(childrenContainer);
        }
        container.appendChild(node);
    }

    function initMap() {
        const treeCache = P.state.repoTreeCache || [];
        if (treeCache.length === 0) {
            contentEl.innerHTML = '<div style="text-align:center;color:#94a3b8;margin-top:50px">暂无数据，请先进入一个仓库</div>';
            return;
        }
        contentEl.innerHTML = '';
        const treeData = buildTree(treeCache);
        Object.keys(treeData).forEach(key => {
            renderNode(key, treeData[key], contentEl);
        });
    }

    fab.onclick = () => {
        initMap();
        modal.classList.add('active');
    };

    closeBtn.onclick = () => modal.classList.remove('active');
    modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('active');
    };
})();