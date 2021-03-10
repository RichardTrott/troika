module.exports = {
  eleventyNavigation: {
    key: data => data.title,
    parent: data => data.parent,
    order: data => data.order
  },
  layout: data => data.layout || 'main'
};