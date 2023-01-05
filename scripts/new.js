import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import mp3Duration from 'mp3-duration'
import id3 from 'node-id3'

const args = process.argv.slice(2)
const episodeNumber = args[0]
const paddedEpisodeNumber = episodeNumber.toString().padStart(3, '0')

const filename = `${paddedEpisodeNumber}.mp3`

const tags = id3.read(filename)
const title = tags.title || `${episodeNumber} - TODO title`
const summary = tags.comment.text
console.log(summary)

const stats = fs.statSync(filename)
const length = stats.size;
let duration = null

await mp3Duration(filename, function (err, seconds) {
  if (err) return console.log(err.message)
  duration = new Date(seconds * 1000).toISOString().slice(11, 19)
})

const pubDate = new Date().toUTCString().replace('GMT', '+0000')

const content = `---
layout: episode
guid: ${uuidv4()}
title: "${title}"
published: "${pubDate}"
permalink: ${episodeNumber}/index.html
file: "https://ruminatepod.s3-us-west-2.amazonaws.com/${paddedEpisodeNumber}.mp3"
length: ${length}
duration: ${duration}
summary: "${summary}"
episodeNumber: ${episodeNumber}
---`

fs.writeFile(`episodes/${paddedEpisodeNumber}.md`, content, function (err) {
    if (err) throw err;
    console.log(`Created episode ${paddedEpisodeNumber} successfully.`);
})
