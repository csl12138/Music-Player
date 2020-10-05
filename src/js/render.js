// 该模块仅用于渲染页面信息
;(function(root) {
    // 渲染背景图片、封面 
    function bgBlur(src) {
        root.blurImg(src);

        const coverPic = document.querySelector(".cover-picture>img");
        coverPic.src = src
    }

    // 渲染歌曲信息
    function renderDesc(data) {
        const children = document.querySelector(".description").children;
        children[0].innerHTML = data.name;
        children[1].innerHTML = data.singer;
        children[2].innerHTML = data.album;
    }

    // 渲染是否喜欢
    function isLike(boolean) {
        const likeRec = document.querySelector(".control>ul").children[0];
        likeRec.className = boolean ? "liked" : "";
    }

    // 是否显示正在连接 true表示已加载完
    function isLoaded(boolean) {
        const loading = document.getElementsByClassName("loading")[0];
        loading.style.visibility = boolean ? "hidden" : "visible";
    }

    // 导出
    root.render = {
        renderAll(data) {
            bgBlur(data.image);
            renderDesc(data);
            isLike(data.isLike);
            isLoaded(false);
        },
        renderLoaded(boolean) {
            isLoaded(boolean)
        }
    }


})(window.player || (window.player = {}))