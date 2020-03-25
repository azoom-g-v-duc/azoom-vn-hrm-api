import { checkoutTimesheet, timeSheet as timeSheetReq } from '@cloudStoreDatabase/time-sheet'

const _ = require('lodash')

module.exports = async (req, res) => {
  const data = _.defaultsDeep(req.body, timeSheetReq)
  await checkoutTimesheet(req.user, data)
  return res.sendStatus(200)
}
