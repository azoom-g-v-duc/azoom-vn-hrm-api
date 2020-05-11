import { paymentCollection} from '@root/database'
import getRole from '@helpers/users/getRole.js'

export default async (req, res) => {
  const userId = req.user.id
  let { page = 1, limit = 15 } = req.query

  // TODO: page, limit must be greater than 0  (handle be OpenAPI)
  // TODO: remove 2 line parser below when openAPI is applied
  page = parseInt(page)
  limit = parseInt(limit)
  const totalIgnorePayment = (page - 1) * limit

  const role = await getRole(userId)
  if(!['admin', 'editor'].includes(role)) return res.sendStatus(403) 

  let connection = paymentCollection()
  if (role === 'user') {
    connection = connection.where('userId', '==', userId)
  }

  const allPayments = await connection.orderBy('created').get()
  connection = connection.orderBy('created').limit(limit)

  let payments
  if (page === 1) {
    payments = await connection.get()
    if(payments.empty) return res.send({ 'count' : allPayments.size, 'paymentApplications': [] })
  } else {
    const lastIgnorePayment = allPayments.docs[totalIgnorePayment - 1]
    payments = await connection.startAfter(lastIgnorePayment.data().created).get()
  }

  return res.send({
    'count' : allPayments.size, 
    'paymentApplications': payments.docs.map(doc => doc.data())
  })
}
