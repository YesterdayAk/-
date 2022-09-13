//生成环境：代码压缩、公共模块分离、资源优化等
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        //压缩js
        minimize: true,
        minimizer: [
            //压缩js
            new TerserPlugin({
                parallel: true, //使用多线程并发执行，提升构建速度 
            })
        ]
    },
})