const merge = require('webpack-merge');
const common = require('./webpack.login.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const version = process.env.VERSION;
if (!version) {
    throw new Error('VERSION environment variable must be specified for production builds');
}

module.exports = merge.merge(common, {
    mode: "production",
    plugins: [
        new HtmlWebpackPlugin({
            base: '/radium' + version + '/',
            template: './html/login.production.html',
            templateParameters: {
                versionTag: version,
            },
            filename: 'login.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: 'node_modules/react/umd/react.production.min.js', to: 'assets/js/' },
                { from: 'node_modules/react-dom/umd/react-dom.production.min.js', to: 'assets/js/' },
                { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'assets/css/' },
                { from: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', to: 'assets/js/' },
            ]
        }),
    ],
});
