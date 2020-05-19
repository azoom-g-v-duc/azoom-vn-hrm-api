const got = require('got')

module.exports = got.extend({
  json: true,
  responseType: 'json',
  baseUrl: process.env.SLACK_APIURL,
  headers: {
    Authorization: `Bearer ${process.env.SLACK_OAUTH_ACCESS_TOKEN}`
  }
})
