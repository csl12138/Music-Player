// 统筹全局
;(function ($, player) {
    
    class MusicPlayer {
        constructor(wrap) {
            this.wrap = wrap;
            this.musicData = null;
            this.indexObj = null;
            this.rotateTimer = null;
            this.loadedEvent = false;
        }
        // 初始化
        init() {
            this.getDom();
            this.sendAjax("../mock/data.json");
        }
        // 初始化一些常用dom
        getDom() {
            this.coverPic = document.querySelector(".cover-picture");
            this.controlBtns = document.querySelectorAll(".control li");
        }
        // 获取数据
        sendAjax(url) {
            $.ajax({
                url,
                method: "GET",
                success: data => {
                    this.musicData = data;
                    this.indexObj = player.index(data.length);

                    this.loadMusic(this.indexObj.index);

                    player.cutSongs.init(data, this.wrap, this.indexObj, (index) => {
                        player.audio.stats = "autoPlay";
                        this.loadMusic(index);
                    });

                    this.bindEvent();
                },
                error() {
                    alert("请求数据失败");
                }
            })
        }
        // 加载所有音乐信息
        loadMusic(index) {
            // 渲染音乐信息
            player.render.renderAll(this.musicData[index]);

            // 绑定音乐加载完毕后的事件 
            if (!this.loadedEvent) {
                this.loadedEvent = true;
                player.audio.loaded(() => {
                    player.audio.renderTotalTime();
                    // 如果加载完毕是暂停状态则不需要开启requestanimationframe
                    if (player.audio.stats === "pause") {
                        player.audio.renderCurTime(false);
                    } else if (player.audio.stats === "play") {
                    // 如果加载完毕是播放状态则需要开启requestanimationframe
                        player.audio.renderCurTime();
                    }
                    player.audio.drag();
                    // 正在连接... 消失
                    player.render.renderLoaded(true);
                    // 点击上一首下一首自动播放
                    if (player.audio.stats === "autoPlay") {
                        player.audio.play();
                        this.controlBtns[2].className = "play";
                        this.coverPicRotate(0);
                    } else {
                        player.audio.isLoad = true;
                    }
                })
                player.audio.ended(() => {
                        player.audio.stats = "autoPlay";
                        this.loadMusic(this.indexObj.next());
                        player.audio.clear();
                        player.cutSongs.changeSelected(this.indexObj.index);
                })
            }
            

            // 加载音乐资源
            player.audio.load(this.musicData[index].audioSrc);

            
        }
        // 绑定事件
        bindEvent() {
            // 播放暂停功能
            this.controlBtns[2].addEventListener("touchend", () => {
                const audio = player.audio;
                // 加载完毕后才能播放
                if (audio.stats === "pause" && audio.isLoad) {
                    audio.play();
                    this.controlBtns[2].className = "play";
                    this.coverPicRotate(+this.coverPic.dataset.rotateDeg || 0);
                } 
                else if (audio.stats === "play") {
                    audio.pause();
                    this.controlBtns[2].className = "";
                    clearInterval(this.rotateTimer);
                    this.rotateTimer = null;
                }
            })
            // 下一首
            this.controlBtns[3].addEventListener("touchend", () => {
                if (!player.audio.isLoad) {
                    return
                }
                player.audio.stats = "autoPlay";
                this.loadMusic(this.indexObj.next());
                player.audio.clear();
                player.cutSongs.changeSelected(this.indexObj.index);
            })
            // 上一首
            this.controlBtns[1].addEventListener("touchend", () => {
                if (!player.audio.isLoad) {
                    return
                }
                player.audio.stats = "autoPlay";
                this.loadMusic(this.indexObj.prev());
                player.audio.clear();
                player.cutSongs.changeSelected(this.indexObj.index);
            })

            // 弹出播放列表
            this.controlBtns[4].addEventListener("touchend", () => {
                if (!player.audio.isLoad) {
                    return
                }
                player.cutSongs.slideUp();
            })
        }

        // 封面跟着旋转
        coverPicRotate(deg) {
            if (this.rotateTimer) {
                clearInterval(this.rotateTimer);
                this.rotateTimer = null;
            }
            this.rotateTimer = setInterval(() => {
                deg = (deg + 0.2) % 360;
                this.coverPic.dataset.rotateDeg = deg;
                this.coverPic.style.transform = `rotate(${deg}deg)`;
            }, 1000/60);
        }

    }

    const mPlayer = new MusicPlayer(document.querySelector(".wrapper"));
    mPlayer.init();

})(window.Zepto, window.player)