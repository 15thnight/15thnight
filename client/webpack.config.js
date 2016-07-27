const config = {
    entry: [
        './src/AppEntry.js'
    ],
    output: {
        path: process.cwd() + '/../_15thnight/static',
        filename: 'bundle.js'
    },
	module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};

module.exports = config;
