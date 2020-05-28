// vue.config.js
module.exports = {
    runtimeCompiler: true,
    publicPath: process.env.NODE_ENV === 'production'
    ? '/mx-division-builds/'
    : '/'
}
// TODO https://medium.com/hceverything/how-to-show-your-app-version-from-package-json-in-your-vue-application-11e882b97d8c