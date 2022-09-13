import Exif from "exif-js";
// 图片压缩
export const imgPreview = (file, callback) => {
    //将base64转换为文件
    function dataURLtoFile(dataurl, file) {
        var arr = dataurl.split(","),
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], file.name, {
            type: file.type
        });
    }
    function rotateImg(img, direction, canvas) {
        //最小与最大旋转方向，图片旋转4次后回到原方向
        const min_step = 0;
        const max_step = 3;
        if (img == null) return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        let height = img.height;
        let width = img.width;
        let step = 0;
        if (direction == "right") {
            step++;
            //旋转到原位置，即超过最大值
            step > max_step && (step = min_step);
        } else {
            step--;
            step < min_step && (step = max_step);
        }
        //旋转角度以弧度值为参数
        let degree = (step * 90 * Math.PI) / 180;
        let ctx = canvas.getContext("2d");
        switch (step) {
            case 1:
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(degree);
                ctx.drawImage(img, 0, -height, width, height);
                break;
            case 2:
                canvas.width = width;
                canvas.height = height;
                ctx.rotate(degree);
                ctx.drawImage(img, -width, -height, width, height);
                break;
            case 3:
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(degree);
                ctx.drawImage(img, -width, 0, width, height);
                break;
            default:
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                break;
        }
    }
    // 压缩图片
    function compress(img, Orientation) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        //瓦片canvas
        let tCanvas = document.createElement("canvas");
        let tctx = tCanvas.getContext("2d");
        let initSize = img.src.length;
        let width = img.width;
        let height = img.height;
        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        let ratio;
        if ((ratio = (width * height) / 4000000) > 1) {
            // console.log("大于400万像素");
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
        } else {
            ratio = 1;
        }
        canvas.width = width;
        canvas.height = height;
        //    铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //如果图片像素大于100万则使用瓦片绘制
        let count;
        if ((count = (width * height) / 1000000) > 1) {
            // console.log("超过100W像素");
            count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
            //      计算每块瓦片的宽和高
            let nw = ~~(width / count);
            let nh = ~~(height / count);
            tCanvas.width = nw;
            tCanvas.height = nh;
            for (let i = 0; i < count; i++) {
                for (let j = 0; j < count; j++) {
                    tctx.drawImage(
                        img,
                        i * nw * ratio,
                        j * nh * ratio,
                        nw * ratio,
                        nh * ratio,
                        0,
                        0,
                        nw,
                        nh
                    );
                    ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                }
            }
        } else {
            ctx.drawImage(img, 0, 0, width, height);
        }
        //修复ios上传图片的时候 被旋转的问题
        if (Orientation && Orientation != 1) {
            // switch (Orientation) {
            //     case 6: //需要顺时针（向左）90度旋转
            //         rotateImg(img, "right", canvas);
            //         break;
            //     case 8: //需要逆时针（向右）90度旋转
            //         rotateImg(img, "left", canvas);
            //         break;
            //     case 3: //需要180度旋转
            //         rotateImg(img, "right", canvas); //转两次
            //         rotateImg(img, "right", canvas);
            //         break;
            // }
        }
        //进行最小压缩
        let ndata = canvas.toDataURL("image/jpeg", 0.5);
        console.log("压缩前：" + initSize);
        console.log("压缩后：" + ndata.length);
        console.log(
            "压缩率：" + ~~((100 * (initSize - ndata.length)) / initSize) + "%"
        );
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
        return ndata;
    }
    let Orientation;
    //去获取拍照时的信息，解决拍出来的照片旋转问题
    Exif.getData(file, function () {
        Orientation = Exif.getTag(this, "Orientation");
    });
    // 看支持不支持FileReader
    if (!file || !window.FileReader) {
        return;
    }
    if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function () {
            let result = this.result;
            let img = new Image();
            img.src = result;
            //判断图片是否大于5M,是就直接上传，反之压缩图片
            if (this.result.length <= 5 * 1024 * 1024) {
                // 上传图片
                let imageFile = dataURLtoFile(this.result, file);
                callback(imageFile);
            } else {
                img.onload = function () {
                    let data = compress(img, Orientation);
                    // 上传图片
                    let imageFile = dataURLtoFile(data, file);
                    callback(imageFile);
                };
            }
        };
    }
};