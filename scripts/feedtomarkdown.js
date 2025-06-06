import fetch from 'node-fetch'
import xml2Json from 'xml2json'
import fs from 'fs'
import TurndownService from 'turndown'
const turndownForWhat = new TurndownService()

async function getEpisodes() {
  try {
    const response = await fetch('https://feeds.libsyn.com/517508/rss');

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.text();
    return result;
  } catch (err) {
    console.log(err);
  }
}

let episodes = await getEpisodes()
episodes = xml2Json.toJson(episodes, { object: true }).rss.channel.item

const filenames = episodes.forEach(episode => {
    let episodeNumber = null
    if (episode.title.includes(': '))
    {
        episodeNumber = episode.title.split(': ')[0]
    } else {
        episodeNumber = episode.title.split(' - ')[0]
    }

    if (episode.title === '35 - Holiday Spectacular 2: Electric Boogaloo')
    {
        episodeNumber = 35
    }

    if (episodeNumber < 180) {
        return;
    }

    const paddedEpisodeNumber = episodeNumber.toString().padStart(3, '0')

    const description = turndownForWhat.turndown(episode.description)

const content = `---
layout: episode
guid: ${episode.guid['$t']}
title: "${episode.title}"
published: "${episode.pubDate}"
permalink: ${episodeNumber}/index.html
file: "${paddedEpisodeNumber}.mp3"
length: ${episode.enclosure.length}
duration: ${episode['itunes:duration']}
summary: "${episode['itunes:subtitle']}"
episodeNumber: ${episodeNumber}
---

${description}
`

    fs.writeFile(`episodes/${paddedEpisodeNumber}.md`, content, function (err) {
        if (err) throw err;
        console.log(`Created episode ${paddedEpisodeNumber} successfully.`);
    })

    // return {
    //     file: episode.enclosure.url,
    //     number: paddedEpisodeNumber,
    // }
})

// const filenamesForDownload = `#!/bin/bash\n${filenames.map(fn => {
//     return `wget ${fn.file} -O ${fn.number}.mp3`
// }).join("\n")}`

// fs.writeFile(`episodes/filenames.sh`, filenamesForDownload, function (err) {
//     if (err) throw err;
//     console.log(`Created filenames file successfully.`);
// })
