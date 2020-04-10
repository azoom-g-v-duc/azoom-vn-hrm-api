const date = require('date-and-time')

export default function (userId, time = new Date()) {
  return userId + '_' + date.format(time, 'YYYYMMDD')
}
