const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
module.exports = {
    entry: './src/client/index.js',
    module: {
        rules: [{
            test: '/\.js$/',
            exclude: /node_module/,
            loader: "babel-loader",
        }]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
//    new BundleAnalyzerPlugin()
    ]
};
