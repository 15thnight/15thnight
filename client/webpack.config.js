const config = {
    entry: [
        './src/AppEntry.js'
    ],
    output: {
        path: __dirname + '/../_15thnight/static',
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
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.json$/, loader: "json-loader" }
        ]
    },
    resolve: {
        alias: {
            lib: __dirname + '/node_modules',

            actions: __dirname + '/src/actions',
            alert: __dirname + '/src/components/alert',
            components: __dirname + '/src/components',
            constants: __dirname + '/src/constants',
            dispatch: __dirname + '/src/dispatch',
            form: __dirname + '/src/components/form',
            pages: __dirname + '/src/components/pages',
            polyfill: __dirname + '/src/polyfill',
            reducers: __dirname + '/src/reducers',
            routes: __dirname + '/src/routes',
            store: __dirname + '/src/store',
            style: __dirname + '/style',
            table: __dirname + '/src/components/table',
            util: __dirname + '/src/util'
        },
        extensions: ['', '.js', '.jsx', '.css'],
        modulesDirectories: [
          'node_modules'
        ]
    }
};

module.exports = config;
