module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'api': '@/api',
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'constant': '@/constant',
        'utils':'@/utils',
        'views': '@/views',
      }
    }
  },
}