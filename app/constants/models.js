import * as firebase from 'firebase'
import date from 'date-and-time'

export const project = {
  id: '',
  projectName: '',
  createdUserId: '',
  startDate: '',
  endDate: '',
  status: -1,
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: '',
}

export const leaveApplication = {
  id: '',
  userId: '',
  approvalUserId: '',
  approvalCosre: 0,
  requiredDates: [],
  requiredContent: '',
  status: -1,
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: '',
}

export const timesheetApplication = {
  id: '',
  userId: '',
  approvalUserId: [],
  startTime: '',
  endTime: '',
  requiredDate: '',
  timesheetId: '',
  requiredContent: '',
  approvalCosre: 0,
  status: -1,
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: '',
}

export const timesheet = {
  id: '',
  userId: '',
  startTime: '',
  endTime: '',
  leaveTypeId: '',
  checkedDate: date.format(new Date(), 'YYYY/MM/DD'),
  isCorrect: false,
}

export const member = {
  id: '',
  name: '',
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: '',
  createdUserId: ''
}
