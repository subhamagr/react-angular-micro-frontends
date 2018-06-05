const path = require('path');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function (env) {
    const analyzeBundle = !!(env && env.analyzeBundle);
    const prodMode = !!(env && env.prod);


    const plugins = [
        new ContextReplacementPlugin(
            /(.+)?angular(\\|\/)core(.+)?/,
            path.resolve(__dirname, '../src')
        ),
        new AngularCompilerPlugin({
            mainPath: path.resolve(__dirname, 'src/singleSpaEntry.ts'),
            tsConfigPath: path.resolve(__dirname, 'tsconfig.json'),
            sourceMap: !prodMode,
            skipCodeGeneration: !prodMode,
            platform: 0,
            hostReplacementPaths: {
                "environments/environment.ts": prodMode ? "environments/environment.prod.ts" : "environments/environment.ts"
            }
        })
    ];

    if (analyzeBundle) {
        plugins.push(new BundleAnalyzerPlugin());
    }

    const devTypescriptLoader = [
        {
            test: /\.ts$/,
            loader: '@ngtools/webpack'
        }
    ];

    const prodTypescriptLoader = [
        {
            "test": /\.js$/,
            "use": [
                {
                    "loader": "@angular-devkit/build-optimizer/webpack-loader",
                    "options": {
                        "sourceMap": false
                    }
                }
            ]
        },
        {
            test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
            use: [
                {
                    "loader": "@angular-devkit/build-optimizer/webpack-loader",
                    "options": {
                        "sourceMap": false
                    }
                },
                '@ngtools/webpack'
            ]
        }
    ];

    const typescriptLoader = prodMode ? prodTypescriptLoader : devTypescriptLoader;

    return {
        entry: {
            singleSpaEntry: 'src/singleSpaEntry.ts',
            store: 'src/store/store.ts'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'release'),
            libraryTarget: 'umd',
            library: 'dashboard-form'
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    loader: "raw-loader"
                },
                {
                    test: /\.css$/,
                    use: ["to-string-loader", "style-loader", 'css-loader']
                },
                {
                    test: /\.(jpe?g|png|webp|gif|otf|ttf|woff2?|ani)$/,
                    loader: "url-loader",
                    options: {
                        name: "[name].[hash:20].[ext]",
                        limit: 10000,
                        publicPath: '/dashboard-form/'
                    }
                },
                {
                    test: /\.(eot|svg|cur)$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash:20].[ext]",
                        publicPath: '/dashboard-form/'
                    }
                },
                {
                    exclude: [
                        path.join(process.cwd(), "src/styles.scss")
                    ],
                    test: /\.scss$|\.sass$/,
                    use: ["exports-loader?module.exports.toString()", "css-loader", "sass-loader", 'postcss-loader']
                },
                {
                    include: [
                        path.join(process.cwd(), "src/styles.scss")
                    ],
                    test: /\.scss$|\.sass$/,
                    use: ["style-loader", "css-loader", "sass-loader", 'postcss-loader']
                }
            ].concat(typescriptLoader)
        },
        resolve: {
            extensions: [".ts", ".js"],
            modules: [
                __dirname,
                'node_modules'
            ]
        },
        devtool: prodMode ? 'none' : 'inline-sourcemap',
        externals: [],
        plugins: plugins,
        devServer: {
            historyApiFallback: true,
            watchOptions: {aggregateTimeout: 300, poll: 1000},
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            }
        }
    }
};