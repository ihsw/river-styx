var request = require('supertest')
var test = require('tape')
var HTTPStatus = require('http-status')
var app = require('./app')

var errorCallback = (t, err, res) => {
    t.equal(err, null, 'GET err was not null')
    t.end()
}

var testRequest = (t, url, status, body) => {
    request(app)
        .get(url)
        .expect(status)
        .expect(body)
        .end((err, res) => errorCallback(t, err, res))
}

test(
    'Homepage Should fail with NOT_FOUND',
    (t) => testRequest(t, '/', HTTPStatus.NOT_FOUND, 'FOUR OH FOUR!')
)

test(
    'AWG Should return AWG',
    (t) => testRequest(t, '/awg', HTTPStatus.OK, 'AWG')
)

test(
    'OFC Should return OFC',
    (t) => testRequest(t, '/ofc', HTTPStatus.OK, 'OFC')
)