const got = require('got')

const hrm = got.extend({
  json: true,
  responseType: 'json',
  baseUrl: process.env.SERVER_URL
})

exports.hrmPubSub = ( message ) => {
  const pubSubObj = JSON.parse(Buffer.from(message.data, 'base64').toString())
  hrm.post('slack/slash-command', {
    body: {...pubSubObj}
  })
    .then(() => console.log('OK'))
    .catch(err => console.log(err))
  return 1
}
