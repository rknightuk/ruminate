const escape = require('lodash.escape')
const rfc822Date = require('rfc822-date')

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets")

    eleventyConfig.addCollection("episodes", function(collection) {
        return collection.getFilteredByGlob("episodes/**/*.md").sort((a, b) => {
            return new Date(b.data.published).getTime() - new Date(a.data.published).getTime()
        })
    })

    eleventyConfig.addFilter('dateForEpisode', function(date) {
        return new Date(date).toISOString().split('T')[0]
    })

    eleventyConfig.addFilter("limit", function(array, limit) {
        return array.slice(0, limit)
    })

    // https://www.marclittlemore.com/create-an-eleventy-podcast-feed/
    // RSS
    eleventyConfig.addFilter('rfc822Date', (dateValue) => {
        return rfc822Date(dateValue);
    });

    // Escape characters for XML feed
    eleventyConfig.addFilter('xmlEscape', (value) => {
        return escape(value);
    });

    // Newest date in the collection
    eleventyConfig.addFilter('collectionLastUpdatedDate', (collection) => {
        const date = Math.max(...collection.map((item) => {
            return new Date(item.data.published).getTime()
        }))

        return rfc822Date(new Date(date))
    });
}
