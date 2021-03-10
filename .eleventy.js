const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addWatchTarget("./www/styles/");

  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    root: ["."] // Needed to allow liquid relative `include`s to reach up to the project root
  })

  // eleventyConfig.addCollection("fullSortedNav", collectionApi => {
  //   return collectionApi.getAll().sort((a, b) => (a.data.sort || a.data.title) - (b.data.sort || b.data.title))
  // })

  eleventyConfig.addPassthroughCopy("www/**/*.(jpg|png|webp|svg)")

  return {
    dir: {
      // ⚠️ These values are relative to your input directory.
      includes: "_includes",
      data: "_data",
      output: '_www_dist',
      input: 'www'
    },
    templateFormats: ["md", "liquid", "njk", "svg"],
    pathPrefix: "/v1/",
    // markdownTemplateEngine: 'njk' // Barfs on something, just use liquid default
  }
}
