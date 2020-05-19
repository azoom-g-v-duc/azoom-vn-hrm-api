import { PubSub } from '@google-cloud/pubsub'
import verifySlackRequest from '@helpers/verify-requests/slack'
const pubsub = new PubSub()

export default async (req, res) => {
  if (!verifySlackRequest(req))
    return res.send({
      text: 'We are sorry but we are not able to authenticate you.'
    })
  const reqBuffer = Buffer.from(JSON.stringify({body: {...req.body}, headers: {...req.headers}})) 
  await pubsub.topic(process.env.PUBSUB_TOPIC_NAME).publish(reqBuffer)
  return res.send('We processing your submit. Just a moment!')
}
