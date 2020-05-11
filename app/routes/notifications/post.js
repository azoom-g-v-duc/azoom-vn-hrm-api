import { notificationCollection } from '@root/database'
import { format } from 'date-fns/fp'

export default async (req, res) => {
  const notifiId = req.body.senderId + format('yyyyMMdd-HHmmss', new Date())
  const notification = {
    ...req.body,
    notifiId,
    created: new Date(),
    updated: '',
    status: false,
    triedTimes: 0,
    isActive: true
  }
  await notificationCollection().doc(notifiId).set(notification)
  return res.send(notification)
}
