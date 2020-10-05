;(function(root) {

    class CutSongs {
        
        // 动态创建歌曲列表
        creatList(data, wrap) {
            const list = document.createElement("div"),
                  len = data.length;
            list.className = "list";
            let tempStr = "";
            for (let i = 0; i < len; i++) {
                tempStr += `<dd>${data[i].name}</dd>`
            }
            const htmlStr = `<dl><dt>播放列表</dt>${tempStr}</dl><div class="close">关闭</div>`;
            list.innerHTML = htmlStr;
            wrap.appendChild(list);

            // 为这个对象初始化一些属性
            this.list = list;
            this.DDs = document.querySelectorAll(".list dd");
            this.activeDD = this.DDs[0];

            // 默认状态第一首歌是选中状态
            this.activeDD.className = "playing";
        }

        // 切换选中状态的歌曲
        changeSelected(index) {
            this.activeDD.className = "";
            this.DDs[index].className = "playing";
            this.activeDD = this.DDs[index];
        }
        // 绑定事件，点哪个播放哪个（回调）
        pickAsong(indexObj, callback) {
            this.DDs.forEach((dd, index) => {
                const _this = this;
                dd.dataset.i = index;
                dd.addEventListener("touchend", function() {
                    if (indexObj.index === index) {
                        return;
                    }
                    indexObj.index = index;
                    _this.changeSelected(index);
                    callback(this.dataset.i);
                    _this.slideDown();
                })
            }) 
        }

        // 关闭按钮
        closeEvent() {
            document.querySelector(".list .close").addEventListener("touchend", () => {
                this.slideDown();
            })
        }

        // 列表向下
        slideDown() {
            this.list.style.transform = `translateY(100%)`;
        }

        // 列表向上
        slideUp() {
            this.list.style.transform = `translateY(0)`;
        }

        // init what you want :)
        init(data, wrap, indexObj, callback) {
            this.creatList(data, wrap);
            this.pickAsong(indexObj, callback);
            this.closeEvent();
        }
        
    }

    root.cutSongs = new CutSongs();

})(window.player || (window.player = {}))