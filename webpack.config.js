const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractCss = new ExtractTextPlugin({
    filename: "styles.css"
});


module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './public/'),
        publicPath: "/",
        pathinfo: true,
    },
    devtool: "source-map",
    resolve: {
        modules: [
            'node_modules',
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, './public/'),
        publicPath: "/",
        watchContentBase: true,
        quiet: true,
        compress: true,
        port: 3000,
        watchOptions: {
            ignored: /node_modules/,
        },
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "eslint-loader",
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: require.resolve('babel-loader'),
                options: {
                    presets: ["env", "react"],
                    plugins: ["syntax-object-rest-spread"],
                    cacheDirectory: true,
                }
            },
            {
                test: [/\.sass$/, /\.scss$/, /\.css$/],
                use: ExtractCss.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            }
                        }
                    ]
                })
            },
            {
                test: /\.svg$/,
                enforce: "pre",
                use: [
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [
                                {removeTitle: true},
                                {convertColors: {shorthex: false}},
                                {convertPathData: false}
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: 'file-loader'
            },
            {
                test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: 'static/img/[name].[ext]',
                },
            },
        ]
    },
    plugins: [
        ExtractCss,
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
}; 