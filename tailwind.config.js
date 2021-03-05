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
    extend: {},
  },
  variants: {},
  plugins: [],
}