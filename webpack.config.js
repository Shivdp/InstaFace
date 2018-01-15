const path = require('path'); 

module.exports = {
    entry: path.resolve('./client/src/index.js'),
    output: {
        path: path.resolve('./client/public/'),
        filename: 'bundle.js'
    }, 
    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['enves2016', 'react']
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
}