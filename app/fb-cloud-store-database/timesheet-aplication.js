const date = require('date-and-time')
export const timesheetAplication = {
  id: '',
  userId: '',
  approvalUserId: '',
  startTime: '',
  endTime: '',
  requiredDate,
  timesheetId,
  requiredContent,
  isApproved,
  isActive: true,
  created: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
  updated: '',
}
