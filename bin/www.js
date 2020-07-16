#! /usr/bin/env node
import app from '../src/app.js'

const listeningPort = process.env.PORT || 3000
app.listen(listeningPort, () => {
  console.log(`Listening on ${listeningPort}`)
})
