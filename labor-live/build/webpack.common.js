const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader/dist/index');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin');
const chalk = require('chalk');

module.exports = {
    entry: './src/main.ts', //入口文件
    output: {
        filename: '[name].[contenthash].js', //输出文件
        path: path.resolve(__dirname, '../dist'), //输出文件存放地址
        clean: true
    },
    resolve: {
        extensions: ['.vue', '.js', '.ts', 'tsx'], //表示在import文件时文件后缀名可以不写
        alias: {
            //import的文件在src下的时候可以直接写成 @/...
            '@': path.join(__dirname, '../src')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '我是webpack.config配置的标题',
            template: "./public/index.html",
            //压缩HTML
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].css'
        }),
        new VueLoaderPlugin(), //解析和转换.vue文件的插件
        new ProgressBarPlugin({
            format: `build[:bar]${chalk.green.bold(':percent')}(:elapsed seconds)`
        })
    ],
    module: {
        rules: [
            {
                test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css文件
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg|svga)$/i,
                type: 'asset', //在导出一个data URI 和发送一个单独的文件之间自动选择
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.vue$/i,
                use: ['vue-loader']
            },
            {
                test: /\.(jsx|tsx|js|ts)$/i,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [tsImportPluginFactory({
                            libraryName: 'vant',
                            libraryDirectory: 'es',
                            style: true,
                        })],
                    }),
                    compilerOptions: {
                        module: 'es2015',
                    },
                },
                exclude: /node_modules/,
            },
        ]
    },
    //缓存
    optimization: {
        //deterministic 选项有益于长期缓存
        moduleIds: 'deterministic',
        //使用 optimization.runtimeChunk 选项将 runtime 代码拆分为一个单独的 chunk
        runtimeChunk: 'single',
        splitChunks: {
            //利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源
            //同时保证 client 代码和 server 代码版本一致。
            //这可以通过使用SplitChunksPlugin 插件的 cacheGroups 选项来实现。
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
        minimizer: [
            new CssMinimizerPlugin({
                parallel: true, //使用多线程并发执行，提升构建速度
            })
        ]
    }
}