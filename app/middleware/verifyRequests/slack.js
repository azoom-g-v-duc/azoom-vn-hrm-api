import crypto from 'crypto'
import qs from 'qs'

export default async (req) => {
  const slackSigningSecret = process.env.SLACK_SIGNING_SECRET
  const slackSignature = req.headers['x-slack-signature']
  const requestBody = qs.stringify(req.body, { format: 'RFC1738' })
  const requestTimestamp = req.headers['x-slack-request-timestamp']
  const baseString = 'v0:' + requestTimestamp + ':' + requestBody
  const hash = crypto
    .createHmac("sha256", slackSigningSecret)
    .update(baseString)
    .digest("hex")
  return `v0=${hash}` === slackSignature
}
