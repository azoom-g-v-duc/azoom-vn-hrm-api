import { getTable } from '@configs/database'
import { destroyALLTokenOfUser } from '@cloudStoreDatabase/token-user'
const _ = require('lodash')

module.exports = async (req, res) => {
  const isAll = req.params.isAll
  if (isAll) {
    const isDel = await destroyALLTokenOfUser(req.user.id, req.token.data)
  }
  return res.sendStatus(200)
}
