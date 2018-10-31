let jsonServer = require('json-server')

let server = jsonServer.create()
let router = jsonServer.router('./db.json')
let middlewares = jsonServer.defaults()

server.use(middlewares)

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    // Converts POST to GET and move payload to query params
    // This way it will make JSON Server that it's GET request
    req.method = 'GET'
    req.query = req.body
  }
  // Continue to JSON Server router
  next()
})

// If you need to scope this behaviour to a particular route, use this
server.post('/provinc-names', (req, res, next) => {
  req.method = 'GET'
  req.query = req.body
  next()
})
server.post('/manage-location-list', (req, res, next) => {
  req.method = 'GET'
  req.query = req.body
  next()
})

server.post('/manage-carrier-list', (req, res, next) => {
  req.method = 'GET'
  req.query = req.body
  next()
})

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
