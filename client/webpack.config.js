const ConsoleNotifierPlugin = function () {}

ConsoleNotifierPlugin.prototype.compilationDone = (stats) => {
  const log = (error) => {
    console.log(error.error && error.error.toString())
    error.module.fileDependencies.map(d => console.log(d))
  }
  stats.compilation.errors.forEach(log)
}

ConsoleNotifierPlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', this.compilationDone.bind(this))
}

const config = {
    devtool: 'source-map',
    entry: [
        'babel-polyfill',
        './node_modules/bootstrap3/dist/css/bootstrap.min.css',
        './src/entry.js'
    ],
    output: {
        path: `${__dirname}/../_15thnight/static`,
        filename: 'bundle.js'
    },
    plugins: [ new ConsoleNotifierPlugin() ],
	module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: [
                        'transform-class-properties',
                        'transform-object-rest-spread',
                        'transform-export-extensions',
                        'transform-decorators-legacy',
                        'transform-flow-strip-types'
                    ]
                }
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader?importLoaders=0',
                    'postcss-loader'
                ]
            },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    postcss: require('./postcss.config.js'),
    resolve: {
        alias: {
            actions: `${__dirname}/src/actions`,
            api: `${__dirname}/src/api`,
            c: `${__dirname}/src/components`,
            'react-requests': `${__dirname}/src/react-requests`,
            messages: `${__dirname}/src/messages`,
            reducers: `${__dirname}/src/reducers`,
            routes: `${__dirname}/src/routes`,
            store: `${__dirname}/src/store`,
        },
        extensions: ['', '.js', '.jsx', '.css'],
        modulesDirectories: [
          'node_modules'
        ]
    }
};

module.exports = config;
