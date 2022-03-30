const express = require('express')
const app = express()
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

// Serve public files
app.use(express.static('public'))

// Hook up a template engine
app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/', (req, res) => {
  // res.send('Hallo wereld!')
  res.render('index', {
    title: 'Dit is een index uit EJS',
  })
})

app.get('/flappie', (req, res) => {
  // res.send('Hallo wereld!')
  res.render('flappie', {
    title: 'Dit is flappie',
  })
})

app.get('/quotes', (req, res) => {
  fetchJson('https://quote.api.fdnd.nl/v1/quote').then(function (jsonData) {
    res.render('quotes', {
      title: 'Dit is de quotes pagina',
      quotes: jsonData.data,
    })
  })
})

app.get('/quote/:quoteId', (request, response) => {
  fetchJson(`https://quote.api.fdnd.nl/v1/quote/${request.params.quoteId}`).then(function (
    jsonData
  ) {
    response.render('quote', {
      title: 'Dit is een enkele quote',
      quote: jsonData.data[0],
    })
  })
})

app.set('port', process.env.PORT || 8000)

const server = app.listen(app.get('port'), () => {
  console.log(`Application started on port: ${app.get('port')}`)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}
