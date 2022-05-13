// var path = require('path');
// module.exports = {
//   entry: './src/index.js',
//   output: {
//     path: path.resolve(__dirname, 'build'),
//     filename: 'index.js',
//     libraryTarget: 'commonjs2'
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.jsx?$/,
//         include: path.resolve(__dirname, 'src'),
//         exclude: /(node_modules|bower_components|build)/,
//         loader: 'babel-loader'
//       },
//       {
//           test: /\.scss$/,
//           loaders: ['style-loader', 'css-loader', 'sass-loader']
//       },
//       {
//         test: /\.(jpg|png|gif)$/,
//         loader: 'url-loader',
//         options: {
//           limit: 25000,
//         },
//       },
//     ],
//   },
//   externals: {
//     'react': 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
//   }
// };

'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const { bundler, styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const TerserWebpackPlugin = require( 'terser-webpack-plugin' );

module.exports = {
	devtool: 'source-map',
	performance: { hints: false },

	entry: path.resolve( __dirname, 'src', 'index.js' ),

	output: {
		// The name under which the editor will be exported.
		library: 'ckeditor5-startmobile-custom-build',

		path: path.resolve( __dirname, 'build' ),
		filename: 'index.js',
		libraryTarget: 'umd',
		libraryExport: 'default'
	},

	optimization: {
		minimizer: [
			new TerserWebpackPlugin( {
				sourceMap: true,
				// terserOptions: {
				// 	output: {
				// 		// Preserve CKEditor 5 license comments.
				// 		comments: /^!/
				// 	}
				// },
				extractComments: false
			} )
		]
	},

	plugins: [
		new CKEditorWebpackPlugin( {
			// UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
			// When changing the built-in language, remember to also change it in the editor's configuration (src/ckeditor.js).
			language: 'en',
			additionalLanguages: 'all'
		} ),
		new webpack.BannerPlugin( {
			banner: bundler.getLicenseBanner(),
			raw: true
		} )
	],

	module: {
		rules: [
			{
				test: /\.svg$/,
				use: [ 'raw-loader' ]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							injectType: 'singletonStyleTag',
							attributes: {
								'data-cke': true
							}
						}
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: styles.getPostCssConfig( {
								themeImporter: {
									themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
								},
								minify: true
							} )
						}
					},
				]
			}
		]
	}
};
