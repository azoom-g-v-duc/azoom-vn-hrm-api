const { execute, getDatesBetween } = require('@root/util')
const saveLeaveApplication = require('@routes/applications/leaves/put.js')
const date = require('date-and-time')
const constants = require('@root/constants/index')

module.exports = async (req, res) => {
  const { startDate, endDate, leaveTypeId, userId, requiredContent } = req.body

  const requiredDates = getDatesBetween({
    startDate: date.parse(startDate, 'YYYY/MM/DD'),
    endDate: date.parse(endDate, 'YYYY/MM/DD'),
  })
  const data = {
    id: setId(userId),
    userId,
    requiredDates,
    requiredContent,
    leaveTypeId,
    createdDate: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
    status: constants.status.inPending,
    isActive: true,
  }
  const result = await execute(saveLeaveApplication, { body: data })
  return res.send(result)
}
const setId = (id) => {
  return id + date.format(new Date(), 'YYYYMMDDHHMMSS')
}
