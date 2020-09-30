const router = require('express').Router()
const { orWhereNotExists } = require('../database/connection')
const users = require('../users/users-model')
const bcrypt = require('bcryptjs')

router.post('/register', async (req, res, next) => {
  let user = req.body
  try {
    const hashed = bcrypt.hashSync(user.password, 10)
    user.password = hashed
    const saved = await users.add(user)
    res.status(201).json(saved)
  }
  catch (err) {
    next({ apiCode: 500, apiMessage: 'error registering', ...err })
  }
})

router.post('/login', async (req, res, next) => {
  let { username, password } = req.body

  const [user] = await users.findBy({ username })

  try {
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user
      res.status(200).json({ message: `welcome ${user.username}` })
    }
    else {
      next({ apiCode: 401, apiMessage: 'invalid credentials' })
    }
  }
  catch (err) {
    next({ apiCode: 500, apiMessage: 'error logging in', ...err })
  }
})

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        next({ apiCode: 400, apiMessage: 'Error logging out', ...err })
      }
      else {
        req.send('already logged out')
      }
    })
  }
  else {
    req.send('already logged out')
  }
})

module.exports = router