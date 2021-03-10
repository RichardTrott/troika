// module.exports = {
//   purge: [ 
//     // "./www/_includes/**/*.njk", 
//     // "./www/_includes/**/*.liquid", 
//     // "./www/*.html" 
//   ],
//   darkMode: false, // or 'media' or 'class'
//   theme: {
//     extend: {},
//   },
//   variants: {
//     extend: {},
//   },
//   plugins: [],
// }
module.exports = {
  purge: [ "./www/_layouts/**/*.njk",  "./www/_includes/**/*.njk", "./www/*.html", "./www/*.liquid" ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'cyan': '#00FFFF',
        'magenta': '#FF00FF',
        "cyan-dark": "#005454",
        "mid-blue-dark": "#2A2C55", // Middle color between the two "dark" variants
        'magenta-dark': "#540455",
      }
    },
    fontFamily: {
      'sans': ['brother-1816', 'ui-sans-serif', 'system-ui'],
      'serif': ['joanna-nova', 'ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'body': ['joanna-sans-nova']
    }
  },
  variants: {},
  plugins: [],
}