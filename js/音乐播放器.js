(function() {
    const P = window.parent;
    const Doc = P.document;
    
    if (Doc.getElementById('cloud-float-player')) return;

    const CONFIG = {
        id: 'cloud-float-player',
        exts: ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'],
        color: '#10b981'
    };

    let playList = [];
    let curIndex = 0;
    let isPlaying = false;
    let isExpanded = false;
    
    const style = Doc.createElement('style');
    style.innerHTML = `
        #${CONFIG.id} {
            position: fixed;
            bottom: 120px;
            right: 20px;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #${CONFIG.id} .cover-box {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #1f2937;
            border: 2px solid rgba(255,255,255,0.1);
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            position: relative;
            z-index: 2;
            animation: spin 10s linear infinite;
            animation-play-state: paused;
            transition: transform 0.2s;
        }
        #${CONFIG.id} .cover-box:active { transform: scale(0.9); }
        #${CONFIG.id} .cover-box.playing { animation-play-state: running; border-color: ${CONFIG.color}; box-shadow: 0 0 15px ${CONFIG.color}66; }
        #${CONFIG.id} .cover-box::after {
            content: '\\f001';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-size: 20px;
        }
        #${CONFIG.id} .player-panel {
            background: rgba(17, 24, 39, 0.9);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 10px 15px;
            display: flex;
            flex-direction: column;
            width: 0;
            opacity: 0;
            transform: translateX(20px);
            pointer-events: none;
            transition: all 0.3s ease;
            overflow: hidden;
            white-space: nowrap;
        }
        #${CONFIG.id}.expanded .player-panel {
            width: 240px;
            opacity: 1;
            transform: translateX(0);
            pointer-events: auto;
        }
        .cfp-title { font-size: 12px; color: #fff; margin-bottom: 6px; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
        .cfp-controls { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .cfp-btn { background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 14px; padding: 4px; transition: color 0.2s; }
        .cfp-btn:hover { color: ${CONFIG.color}; }
        .cfp-progress { width: 100%; height: 3px; background: rgba(255,255,255,0.1); margin-top: 8px; border-radius: 2px; position: relative; cursor: pointer; }
        .cfp-bar { height: 100%; background: ${CONFIG.color}; width: 0%; border-radius: 2px; transition: width 0.1s linear; }
        
        body.light-theme #${CONFIG.id} .cover-box { background: #fff; border-color: #e5e7eb; }
        body.light-theme #${CONFIG.id} .cover-box::after { color: #374151; }
        body.light-theme #${CONFIG.id} .player-panel { background: rgba(255, 255, 255, 0.9); border-color: #e5e7eb; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        body.light-theme .cfp-title { color: #1f2937; }
        body.light-theme .cfp-btn { color: #6b7280; }
        
        @keyframes spin { 100% { transform: rotate(360deg); } }
    `;
    Doc.head.appendChild(style);

    const container = Doc.createElement('div');
    container.id = CONFIG.id;
    container.innerHTML = `
        <div class="player-panel">
            <div class="cfp-title">Cloud Music Player</div>
            <div class="cfp-controls">
                <button class="cfp-btn" id="cfp-prev"><i class="fa-solid fa-backward-step"></i></button>
                <button class="cfp-btn" id="cfp-play"><i class="fa-solid fa-play"></i></button>
                <button class="cfp-btn" id="cfp-next"><i class="fa-solid fa-forward-step"></i></button>
                <button class="cfp-btn" id="cfp-list" title="刷新列表"><i class="fa-solid fa-rotate"></i></button>
            </div>
            <div class="cfp-progress"><div class="cfp-bar"></div></div>
        </div>
        <div class="cover-box" id="cfp-cover"></div>
        <audio id="cfp-audio" style="display:none;" crossorigin="anonymous"></audio>
    `;
    Doc.body.appendChild(container);

    const audio = Doc.getElementById('cfp-audio');
    const titleEl = container.querySelector('.cfp-title');
    const playBtn = Doc.getElementById('cfp-play');
    const bar = container.querySelector('.cfp-bar');
    const cover = Doc.getElementById('cfp-cover');
    const progressEl = container.querySelector('.cfp-progress');

    function cleanName(filename) {
        const name = filename.split('/').pop().replace(/\.[^/.]+$/, "");
        return name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function scan() {
        const tree = P.state.repoTreeCache || P.state.files || [];
        if (!Array.isArray(tree)) return;
        
        const temp = [];
        tree.forEach(f => {
            const ext = (f.name || f.path).split('.').pop().toLowerCase();
            if (CONFIG.exts.includes(ext) && f.type !== 'tree') {
                const fullPath = f.path || f.name;
                temp.push({
                    name: cleanName(fullPath),
                    path: fullPath,
                    rawName: f.name || f.path.split('/').pop()
                });
            }
        });
        
        if (temp.length > 0) {
            playList = temp;
            if (typeof P.showToast === 'function') P.showToast(`云端播放器：已加载 ${playList.length} 首音乐`);
        }
    }

    function play(index) {
        if (!playList[index]) return;
        curIndex = index;
        const item = playList[index];
        
        const repo = P.state.currentRepo;
        const branch = P.state.currentBranch;
        const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${item.path}`;
        const finalUrl = typeof P.getProxiedUrl === 'function' ? P.getProxiedUrl(rawUrl) : rawUrl;

        audio.src = finalUrl;
        audio.play().then(() => {
            isPlaying = true;
            updateUI();
        }).catch(() => {
            isPlaying = false;
            updateUI();
            if (typeof P.showToast === 'function') P.showToast('播放失败，请检查网络或代理');
        });

        titleEl.textContent = item.name;
        titleEl.title = item.name;
        
        if (!isExpanded) toggleExpand();
    }

    function updateUI() {
        if (isPlaying) {
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            cover.classList.add('playing');
        } else {
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            cover.classList.remove('playing');
        }
    }

    function toggleExpand() {
        isExpanded = !isExpanded;
        if (isExpanded) container.classList.add('expanded');
        else container.classList.remove('expanded');
    }

    cover.onclick = (e) => {
        e.stopPropagation();
        toggleExpand();
    };

    playBtn.onclick = () => {
        if (playList.length === 0) scan();
        if (audio.src) {
            if (audio.paused) audio.play();
            else audio.pause();
        } else {
            play(0);
        }
    };

    Doc.getElementById('cfp-prev').onclick = () => {
        let next = curIndex - 1;
        if (next < 0) next = playList.length - 1;
        play(next);
    };

    Doc.getElementById('cfp-next').onclick = () => {
        let next = curIndex + 1;
        if (next >= playList.length) next = 0;
        play(next);
    };

    Doc.getElementById('cfp-list').onclick = () => {
        scan();
        if (typeof P.showToast === 'function') P.showToast('已刷新仓库音乐列表');
    };

    audio.onplay = () => { isPlaying = true; updateUI(); };
    audio.onpause = () => { isPlaying = false; updateUI(); };
    audio.onended = () => Doc.getElementById('cfp-next').click();
    audio.ontimeupdate = () => {
        if (audio.duration) {
            bar.style.width = (audio.currentTime / audio.duration * 100) + '%';
        }
    };

    progressEl.onclick = (e) => {
        if (!audio.duration) return;
        const rect = progressEl.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    };

    // 核心逻辑：事件捕获劫持
    const fileListEl = Doc.getElementById('fileList');
    if (fileListEl) {
        fileListEl.addEventListener('click', (e) => {
            const item = e.target.closest('.file-item');
            if (!item) return;
            
            const nameEl = item.querySelector('.file-name');
            if (!nameEl) return;
            
            const fileName = nameEl.textContent.trim();
            const ext = fileName.split('.').pop().toLowerCase();
            
            if (CONFIG.exts.includes(ext)) {
                e.preventDefault();
                e.stopPropagation();
                
                if (playList.length === 0) scan();
                
                const foundIndex = playList.findIndex(p => p.rawName === fileName);
                if (foundIndex !== -1) {
                    play(foundIndex);
                } else {
                    // 如果列表还没同步，临时添加
                    const path = item.dataset.filePath || fileName;
                    playList.unshift({
                        name: cleanName(fileName),
                        path: path,
                        rawName: fileName
                    });
                    play(0);
                }
            }
        }, true); // 使用 true 开启捕获模式，优先处理
    }

    // 初始化扫描
    setTimeout(scan, 1000);
})();