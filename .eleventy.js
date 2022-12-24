module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets")

  eleventyConfig.addCollection("episodes", function(collection) {
    return collection.getFilteredByGlob("episodes/**/*.md")
  })

  eleventyConfig.addFilter('dateForEpisode', function(date) {
    return new Date(date).toISOString().split('T')[0]
  })
}
