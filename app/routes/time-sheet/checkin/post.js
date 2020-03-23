
import { getTable } from '@configs/database'
import {timeSheet as timeSheetReq} from '@models/time-sheet'

const bcrypt = require('bcrypt')
const _ = require("lodash")

module.exports = async (req, res) => {
  const resbody = { 'status':true,'message':'oke','messageCode':'001','data':{'name':'dung'}}
  const data =_.defaultsDeep(req.body,timeSheetReq)
  data.password = bcrypt.hashSync(data.password, 10)
  await savetimeSheet(data)
  return res.status(200).json(resbody);
}

const savetimeSheet = async(timeSheetReq) => {
  console.log(timeSheetReq)
  const timeSheet = await getTable('timeSheet').doc('ghgj').collection(timeSheetReq.id).doc(timeSheetReq.id).set(timeSheetReq)
  return timeSheet
}
