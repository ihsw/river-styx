var http = require('http')
var express = require('express')

// apps
var awg = express()
awg.get('/awg', (req, res) => res.send('AWG'))
var ofc = express()
ofc.get('/ofc', (req, res) => res.send('OFC'))
var miss = express()
miss.all('*', (req, res) => res.status(404).send('FOUR OH FOUR!'))

// app multiplexer
var appMap = {
    '/awg': awg,
    '/ofc': ofc
}
var multiplexer = (req, res) => {
    if (req.url.startsWith('/awg')) {
        return awg(req, res)
    }

    for (var prefix in appMap) {
        if (req.url.startsWith(prefix)) {
            return appMap[prefix](req, res)
        }
    }

    miss(req, res)
}

module.exports = http.createServer(multiplexer)