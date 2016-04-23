var fs = require('fs');
var path = require('path');

module.exports = {

    entry: path.resolve(__dirname, 'example.js'),

    output: {
        filename: 'example.bundle.js'
    },

    target: 'node',

    // keep node_module paths out of the bundle
    externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).reduce(function(ext, mod) {
        ext[mod] = 'commonjs ' + mod
        return ext
    }, {}),

    node: {
        __filename: true,
        __dirname: true
    },

    module: {
        loaders: [{
                test: /\.json$/,
                loader: 'json'
            },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=stage-3' }
        ]
    }

}
