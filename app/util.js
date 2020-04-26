const { camel, snake } = require('to-case')
const _ = require('lodash/fp')
const httpMocks = require('node-mocks-http')

exports.camelize = (obj) => {
  return Object.entries(obj).reduce((o, [key, value]) => {
    o[camel(key)] = value
    return o
  }, {})
}

exports.underscore = (obj) => {
  return Object.entries(obj).reduce((o, [key, value]) => {
    o[snake(key)] = value
    return o
  }, {})
}

exports.flowAsync = (...fns) => {
  const wrap = (fn) => (args) => {
    return new Promise((resolve) => {
      return resolve(args)
    }).then(fn)
  }
  const wrappedFns = fns.map((fn) => wrap(fn))
  return _.flow(wrappedFns)
}

exports.placeholders = (array) => {
  return array.map((_) => '?').join(',')
}

exports.execute = async (func, req) => {
  const mockReq = httpMocks.createRequest(req)
  const mockRes = httpMocks.createResponse()
  mockRes.send = (result) => {
    mockRes.res = result
  }
  await func(mockReq, mockRes)
  return { status: mockRes._getStatusCode(), body: mockRes.res }
}

exports.oneToOne = (leftList, leftKey, rightList, rightKey, as) => {
  leftList.forEach((left) => {
    const right = rightList.find((right) => right[rightKey] === left[leftKey])
    left[as] = right || null
    delete left[leftKey]
  })
}

exports.getDatesBetween = ({ startDate, endDate }) => {
  dates = []

  while (startDate <= endDate) {
    dates.push(date.format(startDate, 'YYYY/MM/DD'))
    startDate = date.addDays(startDate, 1)
  }

  return dates
}
