module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,css}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'code': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace'
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
