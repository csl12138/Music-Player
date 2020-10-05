;(function(root) {

    class Index {
        constructor(len) {
            this.index = 0;
            this.length = len;
        }
        // 下一首
        next() {
            return this.dealIndex(+1)
        }
        // 上一首
        prev() {
            return this.dealIndex(-1)
        }
        // 处理以保证不越界
        dealIndex(val) {
            this.index = (this.index + val + this.length) % this.length;
            return this.index;
        }
    }

    root.index = function(len) {
        return new Index(len);
    }

})(window.player || (window.player = {}))