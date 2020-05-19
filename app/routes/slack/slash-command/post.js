import commandParser from '@helpers/slash-command-parser'
import { execute } from '@root/util.js'
import getUserDetail from '@routes/users/_userId/get.js'
import getUserBySlackId from '@routes/users/_slackId/get.js'
import getUsers from '@routes/users/get.js'
import createUser from '@routes/users/post.js'
import updateUser from '@routes/users/_userId/put.js'
import deactiveUser from '@routes/users/_userId/delete.js'
import updatePermissionUser from '@routes/users/_userId/permission/patch.js'
import getMembers from '@routes/projects/_projectId/members/get.js'
import addMember from '@routes/projects/_projectId/members/post.js'
import removeMember from '@routes/projects/_projectId/members/_memberId/deactive/patch.js'
import getProjects from '@routes/projects/get.js'
import createProject from '@routes/projects/post.js'
import createTimesheetApp from '@routes/applications/timesheets/post.js'
import approvalTimesheetApp from '@routes/applications/timesheets/_timesheetAppId/patch.js'
import deleteTimesheetApp from '@routes/applications/timesheets/_timesheetAppId/delete.js'
import getLeaveApplications from '@routes/applications/leaves/get.js'
import approvalLeaveApplications from '@routes/applications/leaves/_leaveAppId/patch.js'
import createLeaveApplication from '@routes/applications/leaves/post.js'
import deleteLeaveApplication from '@routes/applications/leaves/_leaveAppId/delete.js'
import checkIn from '@routes/timesheets/checkin/post.js'
import checkOut from '@routes/timesheets/checkout/post.js'
import getTimesheets from '@routes/timesheets/get.js'
import getTimesheetsApplication from '@routes/applications/timesheets/get.js'
import slackApi from '@helpers/slack-api'
import getPaymentsApplications from '@routes/applications/payments/get.js'
import createPaymentsApplication from '@routes/applications/payments/post.js'
import deletePaymentsApplication from '@routes/applications/payments/_paymentAppId/delete.js'
import getPaymentDetail from '@routes/applications/payments/_paymentAppId/get.js'
import verifySlackRequest from '@helpers/verify-requests/slack'

const notImplementMessage = 'Sorry. This command is being implemented.'

export default async (req, res) => {
  const request = req.body
  const { user_id } = request.body
  const commandText = request.body.text
  
  if (!verifySlackRequest(request))
    await slackPostMessage(user_id, 'We are sorry but we are not able to authenticate you.')

  const userResponse = await execute(getUserBySlackId, { params: { slackId: user_id } } )
  const user = userResponse.body
  if (!user)
    return await slackPostMessage(userId, 
      `> Sorry, You did not register account before
      > Please register HRM account first`)
  const params = commandParser(commandText)
  const {resource, action} = getSlashCommandAction(commandText)
  
  const slashCommands = {
    ':': () => {
      return `
        -------------------------------------------------------------------------
         R \`/hrm\` → Show help
         R \`/hrm users:profile userId={userId}\` → Get an user
         R \`/hrm users:list \` → Get all user
         R \`/hrm users \` → Get your info
        W \`/hrm users:create id=azoom-19 username=azoom-19 password=123456 email=azoom@gmail.com\` → Create an user
        W \`/hrm users:update id=azoom-19 username=azoom-19 password=123456 email=azoom@gmail.com\` → Update an user
        W \`/hrm users:deactive id=azoom-19\` → Deactive an user
        W \`/hrm users:permission id=azoom-19 permissionId=3\` → Change permission of an user
         R \`/projects:list managerId=azoom-005 memberId=azoom-001\` → List and Find project
        W \`/projects:create id=project-002 managerId=azoom-005 projectName=hrm\` → Create a new project
         R \`/hrm project:get-member projectId=project-005\` → Get all member in project
        W \`/hrm projects:add-member projectId=project-005 userId=azoom-19 positionScore=1 startTime=2020-04-06 endTime=2020-04-08\` → Add an member to project
        W \`/hrm projects:remove-member projectId=project-005 memberId=azoom-19\` → Remove member from a project
        W \`/hrm application-timesheets:create date=2020/05/08 startTime=08:00 endTime=17:00 reason=Hom-nay-troi-dep-qua \` → Create new timesheet application
         R \`/hrm application-timesheets:approval timesheetAppId=tsa-001 status=approve\` → Approve or reject a timesheet application
         R \`/hrm application-timesheets:delete timesheetAppId=tsa-001\` → Delete a timesheet application
         R \`/hrm application-timesheets:list page=1 limit=15 \` → Get list Timesheets Application
         R \`/hrm application-leaves:list page=1 limit=15 \` → Get list Leaves Application
         R \`/hrm application-leaves:create startDate=2020/05/08 endDate=2020/05/09 leaveType=1 reason=hom-nay-troi-mua\` → Create new leave application
        W \`/hrm application-leaves:delete leaveAppId=leaveApp-19\` → Delete leave application
         R \`/hrm application-payments:list page=1 limit=15 \` → Get list Payments Application
         R \`/hrm application-payments:get paymentAppId=payment-001 \` → Get detail of a Payment Application
         R \`/hrm application-payments:create amount=100000 reason=team-building \` → Create a new Payment Application
         R \`/hrm application-payments:delete paymentAppId=payment-001 \` → Delete a new Payment Application
         R \`/hrm timesheets userIds=azoom-19,azoom-20,azoom-21 time=2020-04-30 startDate=2020-04-28 endDate=2020-05-01 \` → Get your timesheet in 'time' and between 'startDate' and 'endDate'
        W \`/hrm checkin\` → Check in
        W \`/hrm checkout\` → Check out
        -------------------------------------------------------------------------
      `
    },
    'users:profile': async (user, { userId }) => {
      const validResult = validParams(['userId'], { userId } , commandText)
      if (validResult !== true) return validResult
      return execute(getUserDetail, { params: { userId }, user })
    },
    'users:list': async (user, { page, limit}) => {
      return execute(getUsers, { query: { page, limit }, user })
    },
    'users:': async (user) => {
      return execute(getUserDetail, { params: { userId: user.id }, user })
    },
    'users:create': async (user, params, commandText) => {
      const validResult = validParams(['id', 'username', 'password', 'email'], params , commandText)
      if (validResult !== true) return validResult
      return execute(createUser, { body: params, user })
    },
    'users:update': async (user, params) => {
      return execute(updateUser, { body: params, user, params: { userId: params.id } })
    },
    'users:deactive': async (user, { id }, commandText) => {
      const validResult = validParams(['id'], { id } , commandText)
      if (validResult !== true) return validResult
      return execute(deactiveUser, { user, params: { userId: id } })
    },
    'users:permission': async (user, { id, positionPermissionId }, commandText) => {
      const validResult = validParams(['id', 'positionPermissionId'], { id, positionPermissionId } , commandText)
      if (validResult !== true) return validResult
      return execute(updatePermissionUser, { user, params: { userId: id }, body: { positionPermissionId } })
    },
    'projects:get-member': async (user, { projectId }, commandText) => {
      const validResult = validParams(['projectId'], { projectId } , commandText)
      if (validResult !== true) return validResult
      return execute(getMembers, { params: { projectId }, user })
    },
    'application-timesheets:approval': async (user, { timesheetAppId, status }, commandText) => {
      const validResult = validParams(['timesheetAppId', 'status'], { timesheetAppId, status } , commandText)
      if (validResult !== true) return validResult
      return execute(approvalTimesheetApp, { params: { timesheetAppId }, user, query: { isApproved: status === "approve" } })
    },
    'projects:add-member': async (user, { projectId, userId, positionScore, startTime, endTime }, commandText) => {
      const validResult = validParams(['projectId', 'userId', 'positionScore'], { projectId, userId, positionScore } , commandText)
      if (validResult !== true) return validResult
      return execute(addMember, { params: { projectId }, user, body: { memberId: userId, position: [ { positionScore, start: startTime, end: endTime } ] } })
    },
    'application-leaves:delete': async (user, { leaveAppId }, commandText) => {
      const validResult = validParams(['leaveAppId'], { leaveAppId } , commandText)
      if (validResult !== true) return validResult
      return execute(deleteLeaveApplication, { params: { leaveAppId }, user })
    },
    'timesheets:': async (user, { userIds, time, startDate, endDate, userId }, commandText) => {
      const validResult = validParams(['userIds'], { userIds } , commandText)
      if (validResult !== true) return validResult
      return execute(getTimesheets, { params: { userIds: userIds || userId, time, startDate, endDate}, user })
    },
    'application-payments:list': async (user, { page, limit }) => {
      return execute(getPaymentsApplications, { query: { page, limit }, user } )
    },
    'application-timesheets:create': async (user, { date, startTime, endTime, reason = "" }, commandText) => {
      const validResult = validParams(['date', 'startTime', 'endTime'], { date, startTime, endTime } , commandText)
      if (validResult !== true) return validResult
      return execute(createTimesheetApp, { body: { requiredDates: date, startTime, endTime, requiredContent: reason }, user } )
    },
    'application-timesheets:list': async (user, { page, limit }) => {
      return execute(getTimesheetsApplication, { query: { page, limit  }, user } )
    },
    'application-timesheets:delete': async (user, { timesheetAppId }, commandText) => {
      const validResult = validParams(['timesheetAppId'], { timesheetAppId } , commandText)
      if (validResult !== true) return validResult
      return execute(deleteTimesheetApp, { params: { timesheetAppId }, user } )
    },
    'permission:list': async (user, params) => {
      return notImplementMessage
    },
    'projects:list': async (user,  { managerId, memberId }) => {
      return execute(getProjects, { query: { managerId, memberId }, user } )
    },
    'projects:create': async (user, { id, managerId, projectName }, commandText) => {
      const validResult = validParams(['id', 'managerId', 'projectName'], { id, managerId, projectName } , commandText)
      if (validResult !== true) return validResult
      return execute(createProject, { body: { id, managerId, projectName }, user } )
    },
    'projects:update-member': async (user, params) => {
      return notImplementMessage
    },
    'projects:remove-member': async (user, { projectId, memberId }, commandText) => {
      const validResult = validParams(['projectId', 'memberId'], { projectId, memberId } , commandText)
      if (validResult !== true) return validResult
      return execute(removeMember, { body: { id, managerId, projectName }, user } )
    },
    'checkin:': async (user) => {
      return execute(checkIn, { user } )
    },
    'checkout:': async (user) => {
      return execute(checkOut, { user } )
    },
    'application-payments:get': async (user, { paymentAppId }) => {
      return execute(getPaymentDetail, { user, query: { paymentAppId } } )
    },
    'application-timesheets:all': async (user, params) => {
      return notImplementMessage
    },
    'application-leaves:create': async (user, { startDate, endDate, leaveType, reason = "" }, commandText) => {
      const validResult = validParams(['startDate', 'endDate', 'leaveType' ], { startDate, endDate, leaveType } , commandText)
      if (validResult !== true) return validResult
      return execute(createLeaveApplication, { body: { startDate, endDate, userId: user.id, leaveTypeId: leaveType, requiredContent: reason }, user })
    },
    'application-leaves:list': async (user, { page = 1, limit = 15 }) => {
      return execute(getLeaveApplications, { query: { pageNumber: page, count: limit }, user })
    },
    'application-leaves:approval': async (user, { leaveAppId, status }, commandText) => {
      const validResult = validParams(['leaveAppId', 'status'], { leaveAppId, status } , commandText)
      if (validResult !== true) return validResult
      return execute(approvalLeaveApplications, { params: { leaveAppId }, user, query: { isApproved: status === "approve" } })
    },
    'application-payments:create': async (user, { amount, reason }, commandText) => {
      const validResult = validParams(['amount', 'reason'], { amount, reason } , commandText)
      if (validResult !== true) return validResult
      return execute(createPaymentsApplication, { body: { amount, reason }, user })
    },
    'application-payments:approval': async (user, params) => {
      return notImplementMessage
    },
    'application-payments:delete': async (user, { paymentAppId }, commandText) => {
      const validResult = validParams(['paymentAppId'], { paymentAppId } , commandText)
      if (validResult !== true) return validResult
      return execute(deletePaymentsApplication, { query: { paymentAppId }, user })
    },
  }

  const executeResponse = await slashCommands[`${resource}:${action}`](user, params, commandText)
  
  await slackApi.post('/chat.postMessage', {
    body: {
      channel: user.slackId,
      text: executeResponse.body || executeResponse
    }
  })

  return res.sendStatus(200)
}

const slackPostMessage = async (channelId, message) => {
  await slackApi.post('/chat.postMessage', {
    body: {
      channel: channelId,
      text: message,
      as_user: true
    }
  })
}

const getSlashCommandAction = commandText => {
  if (!commandText) return {
    resource: "",
    action: ""
  }
  const [resourceArg = "", actionAndParam = ""] = commandText.split(':', 2)
  const [actionArg] = actionAndParam.split(' ', 1)
  const resource = {
    'u': 'users',
    'user': 'users',
    'users': 'users',
    'permission': 'permission',
    'permissions': 'permission',
    'per': 'permission',
    'projects': 'projects',
    'project': 'projects',
    'p': 'projects',
    'checkin': 'checkin',
    'in': 'checkin',
    'checkout': 'checkout',
    'out': 'checkout',
    'timesheet': 'timesheets',
    'timesheets': 'timesheets',
    'ts': 'timesheets',
    'application-timesheet': 'application-timesheets',
    'application-timesheets': 'application-timesheets',
    'ats': 'application-timesheets',
    'application-leave': 'application-leaves',
    'application-leaves': 'application-leaves',
    'al': 'application-leaves',
    'application-payment': 'application-payments',
    'application-payments': 'application-payments',
    'ap': 'application-payments',
  }[resourceArg] || ""
  const action = {
    'l': 'list',
    'list': 'list',
    'c': 'create',
    'create': 'create',
    'per': 'permission',
    'permission': 'permission',
    'd': 'deactive',
    'deactive': 'deactive',
    'u': 'update',
    'update': 'update',
    'p': 'profile',
    'profile': 'profile',
    'gm': 'get-member',
    'get-member': 'get-member',
    'am': 'add-member',
    'add-member': 'add-member',
    'um': 'update-member',
    'update-member': 'update-member',
    'rm': 'remove-member',
    'remove-member': 'remove-member',
    'ap': 'approval',
    'approval': 'approval',
    'r': 'remove',
    'remove': 'remove',
    'all': 'all',
    'del': 'delete',
    'delete': 'delete'
  }[actionArg] || ""

  return {
    resource,
    action
  }
}

const validParams = (requiredParams = [], object, commandText) => {
  const undefinedKey = requiredParams.find(key => object[key] === undefined)
  if (undefinedKey) return `You are missing ${undefinedKey}
  Your command: /hrm ${commandText}`
  return true
}
