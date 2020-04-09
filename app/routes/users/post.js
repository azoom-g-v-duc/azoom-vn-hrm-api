import { isAdmin, isEditor } from '@helpers/check-rule'
import { execute } from '@root/util'
import saveUser from '@routes/users/put'
import bcrypt from 'bcrypt'
import getUserByEmail from '@routes/users/_email/get'
import getUserById from '@routes/users/_userId/get'

const _ = require('lodash/fp')
import date from 'date-and-time'

module.exports = async (req, res) => {
  if (isAdmin(req.user.positionPermissionId) || isEditor(req.user.positionPermissionId)) {
    const data = _.defaultsDeep(defaultUser, req.body)
    if (await isValidUser(data.id, data.email)) {
      data.password = bcrypt.hashSync(data.password, 10)
      await execute(saveUser, { body: data })
      return res.send(data)
    }
    return res.sendStatus(400)
  }

  return res.sendStatus(403)
}

const isValidUser = async (id, email) => {
  const isValidId = (await execute(getUserById, { params: { userId: id } })) ? false : true
  const isValidEmail = (await execute(getUserByEmail, { params: { email } })) ? false : true
  return isValidId & isValidEmail
}

const defaultUser = {
  id: '',
  userName: '',
  fullName: '',
  email: '',
  password: '',
  birthDate: '',
  address: '',
  tel: '',
  zipCode: '',
  totalPaidLeaveDate: 0,
  contractType: 0,
  position: 'Dev',
  positionPermissionId: 1,
  isActive: true,
  created: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
  updated: '',
}
