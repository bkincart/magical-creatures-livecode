import createError from 'http-errors'
import express from 'express'
import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'
import expressSession from 'express-session'
import fs from 'fs'
import flash from 'flash'
import hbsMiddleware from 'express-handlebars'
import { fileURLToPath } from 'url';
const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fields = ['title', 'url', 'description']

// view engine setup
app.set('views', path.join(__dirname, '../views'))
app.engine(
  'hbs',
  hbsMiddleware({
    defaultLayout: 'default',
    extname: '.hbs'
  })
)
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(
  expressSession({
    secret: 'Launch Academy',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
)

app.use(flash())

// flash session
app.use((req, res, next) => {
  if (req.session && req.session.flash && req.session.flash.length > 0) {
    req.session.flash = []
  }
  next()
})

app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.urlencoded({ extended: true }))

const creatureDataPath = path.join(__dirname, "../creatures.json")
const getCreatures = () => {
  let fileContents = fs.readFileSync(creatureDataPath).toString()
  return JSON.parse(fileContents)
}

//YOUR CODE BELOW
app.get('/', (req, res) => {
  res.redirect("/creatures")
})

app.get("/creatures", (req, res) => {
  let creatures = getCreatures()
  console.log(creatures);
  res.render("index", { creatures: creatures })
})

app.get("/creatures/new", (req, res) => {
  res.render("new")
})

app.get("/creatures/:name", (req, res) => {
  // let creatureName = req.params.name
  // let creatures = getCreatures()
  // let myCreature = creatures.find(creature => {
  //   return creatureName === creature.name
  // })
  // // let myCreature = creatures.find(creature => req.params.name === creature.name)
  // res.render("show", { creature: myCreature })
  let creatureName = req.params.name
  let creatures = getCreatures()
  let creature = creatures.find(creature => {
    return creatureName === creature.name
  })
  // let creature = creatures.find(creature => req.params.name === creature.name)
  // res.render("show", { creature: creature })
  if(creature) {
    res.render("show", { creature })
  } else {
    res.status(404).send("That creature has not been discovered yet!")
  }
})

app.post("/creatures", (req, res) => {
  let newCreature = req.body
  let creatures = getCreatures()
  // console.log('newCreature', newCreature);
  // console.log('creatures', creatures);
  creatures.push(newCreature)
  fs.writeFileSync(creatureDataPath, JSON.stringify(creatures))
  // res.render("index", { creatures: creatures }) -- WRONG
  res.redirect("/creatures")
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})


export default app
