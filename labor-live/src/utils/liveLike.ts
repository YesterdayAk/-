
interface liveLike {
    getRandom: (min: any, max: any) => any,
    imgsList: any,
    context: any
    width: number,
    height: number,
    scanning: boolean,
    renderList: any,
    scaleTime: number// 百分比
    loadImages: () => void,
    createRender: () => void,
    scan: () => void,
    start: () => void,
    requestFrame: (cb: any) => void
}

const liveLike: liveLike = {
    getRandom: (min, max) => {
        return min + Math.floor(Math.random() * (max - min + 1))
    },
    imgsList: [],
    context: null,
    width: 0,
    height: 0,
    scanning: false,
    renderList: [],
    scaleTime: 0.1,
    loadImages: () => {
        const images = [
            'https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/bg1.png',
            'https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/bg2.png',
            'https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/bg3.png',
            'https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/bg4.png',
            'https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/bg5.png',
            'https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/bg6.png'
        ];
        const promiseAll: any = [];
        images.forEach((src) => {
            const p = new Promise(function (resolve) {
                const img = new Image;
                img.onerror = img.onload = resolve.bind(null, img);
                img.src = src;
            });
            promiseAll.push(p);
        });
        Promise.all(promiseAll).then((imgsList) => {
            liveLike.imgsList = imgsList.filter((d) => {
                if (d && d.width > 0) return true;
                return false;
            });
            if (liveLike.imgsList.length == 0) {
                console.log('error', 'imgsList load all error');
                return;
            }
        })
    },
    createRender: () => {
        if (liveLike.imgsList.length == 0) return null;
        const basicScale = [0.6, 0.9, 1.2][liveLike.getRandom(0, 2)];

        const getScale = (diffTime: any) => {
            if (diffTime < liveLike.scaleTime) {
                return +((diffTime / liveLike.scaleTime).toFixed(2)) * basicScale;
            } else {
                return basicScale;
            }
        };
        const context = liveLike.context;
        // 随机读取一个图片来渲染
        const image = liveLike.imgsList[liveLike.getRandom(0, liveLike.imgsList.length - 1)]
        const offset = 20;
        const basicX = liveLike.width / 2 + liveLike.getRandom(-offset, offset);
        const angle = liveLike.getRandom(2, 10);
        let ratio = liveLike.getRandom(10, 30) * ((liveLike.getRandom(0, 1) ? 1 : -1));
        const getTranslateX = (diffTime: any) => {
            if (diffTime < liveLike.scaleTime) {// 放大期间，不进行摇摆位移
                return basicX;
            } else {
                return basicX + ratio * Math.sin(angle * (diffTime - liveLike.scaleTime));
            }
        };

        const getTranslateY = (diffTime: any) => {
            return image.height / 2 + (liveLike.height - image.height / 2) * (1 - diffTime);
        };

        const fadeOutStage = liveLike.getRandom(14, 18) / 100;
        const getAlpha = (diffTime: any) => {
            let left = 1 - +diffTime;
            if (left > fadeOutStage) {
                return 1;
            } else {
                return 1 - +((fadeOutStage - left) / fadeOutStage).toFixed(2);
            }
        };

        return (diffTime: any) => {
            // 差值满了，即结束了 0 ---》 1
            if (diffTime >= 1) return true;
            context.save();
            const scale = getScale(diffTime);
            // const rotate = getRotate();
            const translateX = getTranslateX(diffTime);
            const translateY = getTranslateY(diffTime);
            context.translate(translateX, translateY);
            context.scale(scale, scale);
            // context.rotate(rotate * Math.PI / 180);
            context.globalAlpha = getAlpha(diffTime);
            context.drawImage(
                image,
                -image.width / 2,
                -image.height / 2,
                image.width,
                image.height
            );
            context.restore();
        };
    },
    scan() {
        liveLike.context.clearRect(0, 0, liveLike.width, liveLike.height);
        liveLike.context.fillStyle = "rgba(255,255,255,0)";
        liveLike.context.fillRect(0, 0, 160, 400);
        let index = 0;
        let length = liveLike.renderList.length;
        if (length > 0) {
            liveLike.requestFrame(liveLike.scan.bind(this));
            liveLike.scanning = true;
        } else {
            liveLike.scanning = false;
        }
        while (index < length) {
            const child = liveLike.renderList[index];
            if (!child || !child.render || child.render.call(null, (Date.now() - child.timestamp) / child.duration)) {
                // 结束了，删除该动画
                liveLike.renderList.splice(index, 1);
                length--;
            } else {
                // continue
                index++;
            }
        }
    },
    start() {
        const render = liveLike.createRender();
        const duration = liveLike.getRandom(1500, 3000);
        liveLike.renderList.push({
            render,
            duration,
            timestamp: Date.now(),
        });
        if (!liveLike.scanning) {
            liveLike.scanning = true;
            liveLike.requestFrame(liveLike.scan.bind(this));
        }
        return liveLike;

    },
    requestFrame: (cb) => {
        return (
            window.requestAnimationFrame ||
            (window as any).webkitRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        )(cb);
    }
}

export default liveLike