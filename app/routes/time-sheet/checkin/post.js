import {
  timeSheet as timeSheetReq,
  savetimeSheet
} from '@cloudStoreDatabase/time-sheet'
import { getTable } from '@configs/database'

const _ = require('lodash')

module.exports = async (req, res) => {
  const data = _.defaultsDeep(req.body, timeSheetReq)
  await savetimeSheet(req.user, data)
  return res.sendStatus(200)
}
