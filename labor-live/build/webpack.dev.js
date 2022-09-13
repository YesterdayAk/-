
const { merge } = require('webpack-merge');
const common = require("./webpack.common.js");
//开发环境：调试定位、热替换等
module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../dist',
        hot: true,
    },
    optimization: {
        minimize: true
    }
})