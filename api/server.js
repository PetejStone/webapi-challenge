const express = require('express');
const helmet = require('helmet');
const projectsRouter = require('../projects/projectRouter.js')
const actionsRouter = require('../actions/actionRouter.js')
const server = express()

//global middleware
server.use(express.json()) //middleware for body
server.use(helmet()) //middleware for protecting headers
server.use(logger) //middleware for logging requests in terminal

server.use('/api/projects', projectsRouter) //automatically inserts 'api/projects' after '/' in my code
server.use('/api/actions', actionsRouter) //automatically inserts 'api/projects' after '/' in my code

server.get('/', (req, res) => {
    res.send(`<h2>Testing server</h2>`)
  });

function logger(req, res, next) {
    console.log(`${req.method} request was made at ${req.url} on ${new Date().toISOString()}]`)
    next();
}

module.exports = server;