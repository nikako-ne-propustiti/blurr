const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {EnvironmentPlugin} = require('webpack');

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif|jp2|webp|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json', '.mjs', '.wasm'],
    },
    plugins: [
        new CopyPlugin([
            {
                from: 'static',
                to: '.'
            }
        ]),
        new HTMLPlugin({
            template: path.join(__dirname, 'src/index.html'),
        }),
        new EnvironmentPlugin({
            BACKEND_API_URL: 'http://localhost:3001',
            CDN_URL: 'http://localhost:3001'
        }),
    ],
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        historyApiFallback: {
            index: '/',
            disableDotRule: true
        },
    },
};
