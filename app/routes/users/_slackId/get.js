import _ from 'lodash/fp'
const { userCollection } = require('@root/database')

export default async (req, res) => {
  try {
    const { slackId } = req.params
    const user = await userCollection().where('slackId', '==', slackId).limit(1).get()
    if (user.empty) return res.sendStatus(404)

    return res.send(_.omit(['password'], user.docs[0].data()))
  } catch (error) {
    return res.sendStatus(500)
  }
}
