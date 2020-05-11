import { format } from 'date-fns/fp'
import getRole from '@helpers/users/getRole'
import { userCollection } from '@root/database'
const officialContractType = 2

// TODO: Suar routes thanh /paid-leave/substract-paid-leaves
export default async (req, res) => {
  const { userId } = req.params
  try {
    const role = await getRole(req.user.positionPermissionId)
    if (!['admin', 'editor'].includes(role)) return res.sendStatus(403)
    // TODO: Cho phep tru ngay nghi phep theo list user
    const officialUser = await userCollection()
      .where('id', '==', userId)
      .where('contractType', '==', officialContractType)
      .where('totalPaidLeaveDate', '>=', 1)
      .get()
    if (officialUser.empty) return res.sendStatus(400)
    const newTotalPaidLeaveDate =
      officialUser.docs[0].data().totalPaidLeaveDate - 1
    await userCollection()
      .doc(userId)
      .update({
        totalPaidLeaveDate: newTotalPaidLeaveDate,
        updated: format('yyyy/MM/dd HH:mm:ss', new Date()),
      })
    res.send({ message: 'Subtract paid leave successful' })
  } catch (error) {
    res.sendStatus(500)
  }
}
