const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const errorHandler = require('./errorHandler.js')
const session = require('express-session')
const knexSessionStore = require('connect-session-knex')(session)

const usersRouter = require("../users/users-router.js");
const authRouter = require('../auth/authRouter')

const server = express();

const sessionConfig = {
  name: 'ajucookie',
  secret: process.env.SECRET || 'its a secret to everyone',
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false,
    httpOnly: true,

  },
  resave: false,
  saveUnitialized: false,


  store: new knexSessionStore({
    knex: require('../database/connection'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 60 * 060 * 1000
  })
}

server.use(session(sessionConfig))
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);
server.use('/api/auth', authRouter)

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use(errorHandler)

module.exports = server;
