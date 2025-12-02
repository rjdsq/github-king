(function() {
    const parentWindow = window.parent;
    const doc = document;
    let playList = [];
    let currentIndex = 0;
    let isRandom = false;
    const supportedExts = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];

    const iframe = window.frameElement;
    if (iframe) {
        iframe.style.pointerEvents = 'auto';
        iframe.style.zIndex = '999999';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        doc.body.style.background = 'transparent';
    }

    const style = doc.createElement('style');
    style.innerHTML = `
        * { box-sizing: border-box; user-select: none; -webkit-tap-highlight-color: transparent; }
        #app-player {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 320px;
            background: rgba(16, 18, 27, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            z-index: 10000;
            overflow: hidden;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
            transform-origin: bottom right;
        }
        #app-player.minimized {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #10b981, #3b82f6);
        }
        #app-player.minimized .player-body, 
        #app-player.minimized .playlist-panel { display: none; }
        #app-player.minimized::after {
            content: '\\f001';
            font-family: "Font Awesome 6 Free";
            font-weight: 900;
            font-size: 20px;
        }
        .player-header {
            padding: 12px 15px;
            background: rgba(255,255,255,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .track-info {
            padding: 15px;
            text-align: center;
        }
        .track-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #e0e7ff;
        }
        .track-meta {
            font-size: 10px;
            color: #94a3b8;
        }
        .controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            padding-bottom: 15px;
        }
        .btn {
            background: none;
            border: none;
            color: #e0e7ff;
            cursor: pointer;
            font-size: 16px;
            transition: 0.2s;
            opacity: 0.8;
        }
        .btn:hover { opacity: 1; transform: scale(1.1); }
        .btn-main {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #10b981, #3b82f6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        .progress-container {
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.1);
            cursor: pointer;
            position: relative;
        }
        .progress-bar {
            height: 100%;
            background: #3b82f6;
            width: 0%;
            border-radius: 0 2px 2px 0;
            position: relative;
        }
        .playlist-panel {
            max-height: 0;
            overflow-y: auto;
            background: rgba(0,0,0,0.2);
            transition: max-height 0.3s ease;
        }
        .playlist-panel.open { max-height: 200px; }
        .playlist-item {
            padding: 8px 15px;
            font-size: 12px;
            color: #cbd5e1;
            cursor: pointer;
            border-bottom: 1px solid rgba(255,255,255,0.03);
            display: flex;
            justify-content: space-between;
        }
        .playlist-item:hover { background: rgba(255,255,255,0.05); }
        .playlist-item.active { color: #3b82f6; font-weight: bold; background: rgba(59, 130, 246, 0.1); }
        .playlist-item .duration { opacity: 0.6; font-size: 10px; }
        .min-btn { font-size: 12px; opacity: 0.5; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 2px; }
    `;
    doc.head.appendChild(style);

    const wrapper = doc.createElement('div');
    wrapper.id = 'app-player';
    wrapper.innerHTML = `
        <div class="player-header">
            <span style="font-size:12px; font-weight:bold; color:#10b981;"><i class="fa-solid fa-cloud"></i> CloudMusic</span>
            <div style="display:flex; gap:10px;">
                <button class="btn min-btn" id="toggleList"><i class="fa-solid fa-list"></i></button>
                <button class="btn min-btn" id="minimizeBtn"><i class="fa-solid fa-minus"></i></button>
            </div>
        </div>
        <div class="player-body">
            <div class="track-info">
                <div class="track-title" id="mTitle">未播放</div>
                <div class="track-meta" id="mMeta">等待操作...</div>
            </div>
            <div class="controls">
                <button class="btn" id="prevBtn"><i class="fa-solid fa-backward-step"></i></button>
                <button class="btn btn-main" id="playBtn"><i class="fa-solid fa-play"></i></button>
                <button class="btn" id="nextBtn"><i class="fa-solid fa-forward-step"></i></button>
                <button class="btn" id="modeBtn" title="顺序播放"><i class="fa-solid fa-repeat"></i></button>
            </div>
            <div class="progress-container" id="progressWrap">
                <div class="progress-bar" id="progressBar"></div>
            </div>
        </div>
        <div class="playlist-panel" id="playlist"></div>
        <audio id="audioEl" crossorigin="anonymous"></audio>
    `;
    doc.body.appendChild(wrapper);

    const audio = doc.getElementById('audioEl');
    const playBtn = doc.getElementById('playBtn');
    const progressBar = doc.getElementById('progressBar');
    const mTitle = doc.getElementById('mTitle');
    const mMeta = doc.getElementById('mMeta');
    const playlistEl = doc.getElementById('playlist');
    const toggleListBtn = doc.getElementById('toggleList');
    const minimizeBtn = doc.getElementById('minimizeBtn');
    const modeBtn = doc.getElementById('modeBtn');

    function formatName(name) {
        return name.replace(/\.[^/.]+$/, "");
    }

    function scanRepoMusic() {
        const repoCache = parentWindow.state.repoTreeCache;
        const currentFiles = parentWindow.state.files;
        let source = [];

        if (repoCache && Array.isArray(repoCache)) {
            source = repoCache;
        } else if (currentFiles && Array.isArray(currentFiles)) {
            source = currentFiles;
        }

        const newMap = new Map();
        
        source.forEach(file => {
            const ext = file.path ? file.path.split('.').pop().toLowerCase() : '';
            if (supportedExts.includes(ext) && file.type !== 'tree' && file.type !== 'dir') {
                const cleanName = formatName(file.name || file.path.split('/').pop());
                const rawUrl = file.download_url || 
                    `https://raw.githubusercontent.com/${parentWindow.state.currentRepo}/${parentWindow.state.currentBranch}/${file.path}`;
                
                newMap.set(file.path, {
                    name: cleanName,
                    path: file.path,
                    url: parentWindow.getProxiedUrl(rawUrl),
                    originalUrl: rawUrl
                });
            }
        });

        playList = Array.from(newMap.values());
        renderPlaylist();
    }

    function renderPlaylist() {
        playlistEl.innerHTML = '';
        if (playList.length === 0) {
            playlistEl.innerHTML = '<div style="padding:10px; text-align:center; color:#64748b;">当前仓库无音乐</div>';
            return;
        }
        playList.forEach((item, index) => {
            const div = doc.createElement('div');
            div.className = `playlist-item ${index === currentIndex ? 'active' : ''}`;
            div.innerHTML = `<span>${index + 1}. ${item.name}</span>`;
            div.onclick = () => playTrack(index);
            playlistEl.appendChild(div);
        });
        mMeta.textContent = `播放列表: ${playList.length} 首`;
    }

    function playTrack(index) {
        if (!playList[index]) return;
        currentIndex = index;
        const track = playList[index];
        
        audio.src = track.url;
        audio.play().catch(e => console.log('Auto-play blocked', e));
        
        mTitle.textContent = track.name;
        mMeta.textContent = `缓冲中...`;
        updatePlayState(true);
        renderPlaylist();
        
        if (typeof parentWindow.showToast === 'function') {
            parentWindow.showToast(`正在播放: ${track.name}`);
        }
    }

    function updatePlayState(isPlaying) {
        playBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    }

    function togglePlay() {
        if (audio.paused) {
            if (!audio.src && playList.length > 0) playTrack(0);
            else audio.play();
        } else {
            audio.pause();
        }
    }

    function nextTrack() {
        if (playList.length === 0) return;
        let nextIndex;
        if (isRandom) {
            nextIndex = Math.floor(Math.random() * playList.length);
        } else {
            nextIndex = (currentIndex + 1) % playList.length;
        }
        playTrack(nextIndex);
    }

    function prevTrack() {
        if (playList.length === 0) return;
        let prevIndex = (currentIndex - 1 + playList.length) % playList.length;
        playTrack(prevIndex);
    }

    playBtn.onclick = togglePlay;
    doc.getElementById('nextBtn').onclick = nextTrack;
    doc.getElementById('prevBtn').onclick = prevTrack;

    modeBtn.onclick = () => {
        isRandom = !isRandom;
        modeBtn.innerHTML = isRandom ? '<i class="fa-solid fa-shuffle"></i>' : '<i class="fa-solid fa-repeat"></i>';
        modeBtn.title = isRandom ? '随机播放' : '顺序播放';
        if (typeof parentWindow.showToast === 'function') {
            parentWindow.showToast(isRandom ? '已切换：随机播放' : '已切换：顺序播放');
        }
    };

    audio.addEventListener('play', () => updatePlayState(true));
    audio.addEventListener('pause', () => updatePlayState(false));
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${percent}%`;
            mMeta.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }
    });
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('error', () => {
        mMeta.textContent = "加载失败，尝试下一首";
        setTimeout(nextTrack, 1000);
    });

    doc.getElementById('progressWrap').onclick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (audio.duration) audio.currentTime = pos * audio.duration;
    };

    toggleListBtn.onclick = () => {
        playlistEl.classList.toggle('open');
    };

    minimizeBtn.onclick = () => {
        wrapper.classList.toggle('minimized');
        if (wrapper.classList.contains('minimized')) {
            playlistEl.classList.remove('open');
        }
    };

    wrapper.onclick = (e) => {
        if (wrapper.classList.contains('minimized')) {
            wrapper.classList.remove('minimized');
        }
    };

    function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    }

    if (parentWindow.audioManager) {
        parentWindow.audioManager.play = function(url, name) {
            const cleanName = formatName(name);
            const exists = playList.findIndex(p => p.url === url || p.name === cleanName);
            
            if (exists !== -1) {
                playTrack(exists);
            } else {
                playList.unshift({
                    name: cleanName,
                    url: url,
                    path: 'temp'
                });
                renderPlaylist();
                playTrack(0);
            }
            if (wrapper.classList.contains('minimized')) {
                wrapper.classList.remove('minimized');
            }
        };
    }

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    const dragHeader = wrapper.querySelector('.player-header');

    dragHeader.addEventListener('mousedown', dragStart);
    dragHeader.addEventListener('touchstart', dragStart, {passive: false});

    function dragStart(e) {
        if (e.target.closest('button')) return;
        e.preventDefault();
        if (wrapper.classList.contains('minimized')) return;
        
        isDragging = true;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const rect = wrapper.getBoundingClientRect();
        startX = clientX;
        startY = clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        doc.addEventListener('mousemove', drag);
        doc.addEventListener('touchmove', drag, {passive: false});
        doc.addEventListener('mouseup', dragEnd);
        doc.addEventListener('touchend', dragEnd);
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const dx = clientX - startX;
        const dy = clientY - startY;
        
        wrapper.style.right = 'auto';
        wrapper.style.bottom = 'auto';
        wrapper.style.left = `${initialLeft + dx}px`;
        wrapper.style.top = `${initialTop + dy}px`;
    }

    function dragEnd() {
        isDragging = false;
        doc.removeEventListener('mousemove', drag);
        doc.removeEventListener('touchmove', drag);
        doc.removeEventListener('mouseup', dragEnd);
        doc.removeEventListener('touchend', dragEnd);
    }

    const observer = new MutationObserver(() => {
        if (parentWindow.state.currentRepo) {
            setTimeout(scanRepoMusic, 1000);
        }
    });
    
    observer.observe(parentWindow.document.getElementById('repoList'), { childList: true, subtree: true });
    observer.observe(parentWindow.document.getElementById('fileList'), { childList: true, subtree: true });

    scanRepoMusic();
    
    if (typeof parentWindow.showToast === 'function') {
        parentWindow.showToast('云端音乐播放器已就绪', 'success');
    }
})();