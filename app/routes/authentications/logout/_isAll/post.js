import { getTable } from '@configs/database'
import {userToken} from '@models/token-user'
const _ = require("lodash")


module.exports = async (req, res) => {
  const isAll = req.params.isAll
  if(isAll){
    const isDel = await destroyALLTokenOfUser(req.user.id, req.token.data.tokenCode)
  }
  return res.sendStatus(200)
  }
export const destroyALLTokenOfUser = async(userId,tokenFromClient)=>{ 
  const data = _.defaultsDeep({isActive:false},userToken)
  const result = await getTable('userToken').where('userId', '==', userId).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, " => ", doc.data())
          getTable('userToken').doc(doc.id).update(data)
        })
    })
  return result
}