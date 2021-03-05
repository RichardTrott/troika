module.exports = {
  eleventyNavigation: {
    key: data => data.title,
    parent: data => data.parent
  },
  layout: data => data.layout || 'main'
};