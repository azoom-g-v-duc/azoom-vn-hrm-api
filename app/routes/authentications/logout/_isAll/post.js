import { getTable } from '@configs/database'
import {userToken} from '@models/token-user'
const _ = require("lodash")


module.exports = async (req, res) => {
  const isAll = req.params.isAll
  if(isAll){
    const isDel = await destroyALLTokenOfUser(req.user.id,req.token.data, req.token.data.tokenCode)
  }
  return res.sendStatus(200)
  }
export const destroyALLTokenOfUser = async(userId,token,tokenFromClient)=>{ 
  const data = _.defaultsDeep({isActive:false},token)
  const result = await getTable('userToken').where('userId', '==', userId).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const data = _.defaultsDeep({isActive:false},doc.data())
          getTable('userToken').doc(doc.id).update(data)
        })
    })
  return result
}