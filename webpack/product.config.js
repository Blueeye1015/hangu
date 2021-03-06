var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require('strip-loader');

var writeStats = require('./utils/writeStats')
var assetsPath = path.join(__dirname, '../static/dist');

module.exports = {
	devtool: 'source-map',
	context: path.resolve(__dirname, '..'),
	entry: {
		'main': './src/client.js'
	},
	output: {
		path: assetsPath,
		filename: '[name]-[chunkhash].js',
		chunkFilename: '[name]-[chunkhash].js',
		publicPath: '/dist/'
	},
	module: {
		loaders: [
			{ test: /\.(jpe?g|png|gif|svg)$/, loader: 'file' },
			{ test: /\.jsx?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel?stage=0&optional=runtime&plugins=typecheck']},
			{ test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?browsers=last 2 version!sass') }
		]
	},
	resolve: {
		extensions: ['', '.json', '.js', '.jsx']
	},
	plugins: [

		// css 文件单独拉出来
		new ExtractTextPlugin('[name]-[chunkhash].css'),

		// ignore dev config
		new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

		// 设几个全局变量
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__SERVER__: false,
			__DEVELOPMENT__: false,
			__DEVTOOLS__: false,
			'process.env': {
				BROWSER: JSON.stringify(true),
				NODE_ENV: JSON.stringify('production')
			}
		}),

		// 打包过程中删除相同或类似的文件
		new webpack.optimize.DedupePlugin(),
		// Assign the module and chunk ids by occurrence count
		new webpack.optimize.OccurenceOrderPlugin(),
		// uglify
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),

		function () {
			this.plugin('done', writeStats)
		}

	]
}