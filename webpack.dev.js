const path = require('path');

module.exports = {
    entry: {
        main: './dist/compiled/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/dev-build'),
        filename: 'app-bundle.js',
        clean: true
    },
    mode: 'development',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/, // Specify the file extension for the test
                exclude: /node_modules/,
                use: 'babel-loader' // Corrected 'loader' to 'use'
            }
        ]
    }
};
