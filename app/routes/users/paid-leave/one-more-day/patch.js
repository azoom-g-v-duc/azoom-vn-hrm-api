import firebase from 'firebase'
import { format } from 'date-fns/fp'
import { userCollection } from '@root/database'
import googleCloudScheduler from '@middleware/verifyRequests/googleCloudScheduler'
const fireStore = firebase.firestore()
const officialContractType = 2
const validDateAddPaidLeave = '01'
export default async (req, res) => {
  try {
    const nowDate = format('dd', new Date())
    if (nowDate !== validDateAddPaidLeave) return res.sendStatus(400)
    const authToken = req.header('AUTHORIZATION') || ''
    const isValidToken = await googleCloudScheduler(authToken)
    if (!isValidToken) return res.sendStatus(401)
    const officialUsers = await userCollection()
      .where('contractType', '==', officialContractType)
      .get()
    if (officialUsers.empty) return res.sendStatus(404)
    await fireStore.runTransaction(async (transaction) => {
      await officialUsers.forEach((user) => {
        const newTotalPaidLeaveDate = user.data().totalPaidLeaveDate + 1
        transaction.update(user.ref, {
          totalPaidLeaveDate: newTotalPaidLeaveDate,
          updated: format('yyyy/MM/dd HH:mm:ss', new Date()),
        })
      })
    })
    res.send({ message: 'Add paid leave successful' })
  } catch (error) {
    res.sendStatus(500)
  }
}
