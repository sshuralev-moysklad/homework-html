const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
    entry: './src/main.tsx',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            noEmit: false,
                        },
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.module\.css$/i,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                namedExport: false,
                                exportLocalsConvention: 'as-is',
                            },
                            esModule: true,
                        }
                    },
                    'postcss-loader'
                ],
            },
            {
                test: /\.css$/i,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                exclude: /\.module\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false
                        }
                    },
                    {
                        loader: "css-loader"
                    },
                    'postcss-loader'
                ],
            },
            {
                test: /\.svg$/i,
                type: 'asset/resource',
            },
        ],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:3001',
                pathRewrite: { '^/api': '' },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        })
    ]
};
