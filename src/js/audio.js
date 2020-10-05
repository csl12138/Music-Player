;(function(root) {
    class MusicAudio {
        constructor() {
            this.audio = new Audio();
            this.stats = "pause";
            this.isLoad = false;  //确保在第一首歌加载完成之前不能做任何操作
            this.curTimer = null;
            this.curTimeDom = document.querySelector(".progress .cur-time");
            this.circleDom = document.querySelector(".progress .circle");
            this.circleDomWidth = this.circleDom.offsetWidth / 2;
            this.progressBar = document.querySelector(".progress .progressbar");
            this.progressBarBg =  document.querySelector(".progress .progressbar-bg");
            this.draging = false;
        }
        // 加载音乐
        load(src) {
            this.audio.src = src;
            this.audio.load();
        }
        // 播放
        play() {
            this.audio.play();
            this.stats = "play";
            // 如果暂停了
            if (!this.curTimer) {
                this.renderCurTime();
            }
        }
        // 暂停
        pause() {
            this.audio.pause();
            this.stats = "pause";
            cancelAnimationFrame(this.curTimer);
            this.curTimer = null;
        }
        // 进度条跳转
        // 这个事件会重新触发歌曲加载成功的事件
        playTo(time) {
            this.audio.currentTime = time;
        }

        // 专门用于处理时长
        formatTime(count, dom) {
            const minutes = parseInt(count / 60);
            const seconds = parseInt(count % 60);
            const time = `${minutes<10?"0"+minutes:minutes}:${seconds<10?"0"+seconds:seconds}`;
            dom.innerText = time;
        }

        // 渲染总时长
        renderTotalTime() {
            const totalTimeDom = document.querySelector(".progress .total-time");
            this.formatTime(this.audio.duration, totalTimeDom);
        }
        // 当前时长
        renderCurTime(loop=true) {
            // 保证只有一个定时器开着
            if (this.curTimer) {
                cancelAnimationFrame(this.curTimer);
                this.curTimer = null;
            }
            const width = this.progressBarBg.offsetWidth;
            const update = () => {
                if(!this.draging) {
                    this.formatTime(this.audio.currentTime, this.curTimeDom);
                    const disXPersent = this.audio.currentTime / this.audio.duration;
                    this.progressBar.style.width = `${width * disXPersent}px`;
                    this.circleDom.style.left = `${width * disXPersent - this.circleDomWidth}px`;
                    if (loop) {
                        this.curTimer = requestAnimationFrame(update);
                    }
                }
            }
            requestAnimationFrame(update);
        }
        // 切歌时清空当前时长
        clear() {
            this.curTimeDom.innerText = "00:00";
        }

        // 拖拽 
        drag() {
            const curTimeDomwidth = this.curTimeDom.offsetWidth;
            const progressBarBgwidth = this.progressBarBg.offsetWidth;
            let disX = null,
                currentTime = null;
            this.circleDom.addEventListener("touchstart", (e) => {
                this.draging = true;
                window.ontouchmove = (e) => {
                    const tempX = parseInt(e.changedTouches[0].clientX - curTimeDomwidth) < 0 ? 0 : parseInt(e.changedTouches[0].clientX - curTimeDomwidth);
                    disX = tempX>progressBarBgwidth ? progressBarBgwidth : tempX;
                    currentTime = (disX / progressBarBgwidth) * this.audio.duration;
                    this.formatTime(currentTime, this.curTimeDom);
                    this.progressBar.style.width = `${disX}px`;
                    this.circleDom.style.left = `${disX - this.circleDomWidth}px`;
                }
            })
            this.circleDom.addEventListener("touchend", (e) => {
                this.playTo(currentTime);
                this.draging = false;
                window.ontouchmove = null;
            })
            // 进度条点击跳转到当前进度
            this.progressBarBg.addEventListener("touchend", (e) => {
                const targetX = parseInt(e.changedTouches[0].clientX - curTimeDomwidth);
                const targetTime = (targetX /progressBarBgwidth) * this.audio.duration;
                this.playTo(targetTime);
                this.progressBar.style.width = `${targetX}px`;
                this.circleDom.style.left = `${targetX - this.circleDomWidth}px`;
            })
        }

        // 歌曲加载完毕
        loaded(fn) {
            this.audio.oncanplaythrough = fn;
        }

        // 放完一首歌之后
        ended(fn) {
            this.audio.onended = fn;
        }
    }

    root.audio = new MusicAudio();

})(window.player || (window.player = {}))