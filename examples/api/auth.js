const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')

// Create app
const app = express()

// Install middleware
app.use(cookieParser())
app.use(bodyParser.json())

// JWT middleware
app.use(
  jwt({
    secret: 'dummy'
  }).unless({
    path: [
      '/api/auth/login',
      '/api/pro/login'
    ]
  })
)

const generateToken = (username) => {
  return jsonwebtoken.sign(
    {
      username,
      picture: 'https://github.com/nuxt.png',
      name: 'User ' + username,
      scope: ['test', 'user']
    },
    'dummy'
  )
}

// -- Auth Routes --
const auth = express.Router()
// [POST] /login
auth.post('/login', (req, res, next) => {
  const { username, password } = req.body
  const valid = username.length && password === '123'

  if (!valid) {
    throw new Error('Invalid username or password')
  }

  const accessToken = generateToken(username)

  res.json({
    token: {
      accessToken
    }
  })
})

// [GET] /user
auth.get('/user', (req, res, next) => {
  res.json({ user: req.user })
})

// [POST] /logout
auth.post('/logout', (req, res, next) => {
  res.json({ status: 'OK' })
})

// -- Pro Routes --
const pro = express.Router()
// [POST] /login
pro.post('/login', (req, res, next) => {
  const { username, password } = req.body
  const valid = username.length && password === '123'

  if (!valid) {
    throw new Error('Invalid username or password')
  }

  const accessToken = generateToken(username)

  res.json({
    token: {
      accessToken
    }
  })
})

// [GET] /user
pro.get('/user', (req, res, next) => {
  res.json({ user: req.user })
})

// [POST] /logout
pro.post('/logout', (req, res, next) => {
  res.json({ status: 'OK' })
})

app.use('/pro', pro)
app.use('/auth', auth)

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

// -- export app --
module.exports = {
  path: '/api',
  handler: app
}
