import _ from 'lodash/fp'
import bcrypt from 'bcrypt'
import { userCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'
import getUserByEmail from '@routes/users/_email/get'
import getUserById from '@routes/users/_userId/get'

export default async (req, res) => {
  const user = req.body
  const userId = req.user.id
  const role = await getRole(userId)
  if (role !== 'admin' && role !== 'editor') return res.sendStatus(403)

  if(!isValidUser(user.id, user.email)) return res.sendStatus(400)

  const defaultUser = {
    id: '',
    userName: '',
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    address: '',
    tel: '',
    zipCode: '',
    totalPaidLeaveDate: 0,
    contractType: 0,
    position: 'Dev',
    positionPermissionId: 1,
    isActive: true,
    created: new Date(),
    updated: ''
  }
  const newUser = { ...defaultUser, ...user, password: bcrypt.hashSync(user.password, 10)}

  await userCollection().doc(newUser.id).set(newUser)
  res.send(user)
}

const isValidUser = async (id, email) => {
  const isValidId = (await execute(getUserById, { params: { userId: id } })) ? false : true
  const isValidEmail = (await execute(getUserByEmail, { params: { email } })) ? false : true
  return isValidId & isValidEmail
}
