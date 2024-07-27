const { defineConfig } = require('@vue/cli-service');
const { GenerateSW } = require('workbox-webpack-plugin');
module.exports = defineConfig({
  configureWebpack: {
    plugins: [new GenerateSW()],
  },
  transpileDependencies: true,

  pluginOptions: {
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
