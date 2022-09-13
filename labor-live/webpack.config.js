const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
//vue-loader
const { VueLoaderPlugin } = require('vue-loader/dist/index')
//ts-import-plugin
const tsImportPluginFactory = require('ts-import-plugin');


module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "./src/main.ts"), //打包入口地址
    output: {
        path: path.resolve(__dirname, "dist"), //输出文件目录
        filename: '[name].[contenthash].js', //输出文件名
        clean: true
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    'vue-loader'
                ]
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|svga)$/i, //匹配图片文件
                type: 'asset'  //在导出一个 data URI 和发送一个单独的文件之间自动选择
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
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'), //我们要使用的 html 模板地址
            filename: "index.html",
            title: "webpack.config配置的标题",
            //压缩HTML
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true, //删除空白符与换行符
            }
        }),
        //添加 VueLoaderPlugin 插件
        new VueLoaderPlugin(),
    ],
    resolve: {
        extensions: ['.vue', '.js', '.ts', 'tsx'], //表示在import 文件时文件后缀名可以不写
        alias: {
            "@": path.join(__dirname, "src")
        }
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        hot: true,
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:3000',
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
    },
    externals: {
        jquery: 'jQuery'
    },
    //缓存
    optimization: {
        moduleIds: 'deterministic',
        //使用 optimization.runtimeChunk 选项将 runtime 代码拆分为一个单独的 chunk
        runtimeChunk: 'single',
        splitChunks: {
            //利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源
            //同时还能保证 client 代码和 server 代码版本一致。
            //这可以通过使用SplitChunksPlugin 插件的 cacheGroups 选项来实现
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }

    }
}