var path = require("path");

module.exports = {
    entry: {
        app: ["./index.js"]
    },
    output: {
        path: path.join(__dirname, "./out/js/"),
        publicPath: "/out/js/",
        filename: "[name].js"
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.json$/,
                loader: "file-loader"
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015']
                }
            }

        ]
    }
};