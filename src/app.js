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



export default app
