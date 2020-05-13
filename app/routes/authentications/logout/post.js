import {userTokenCollection} from '@root/database'
export default async (req, res) => {
  const { isAll = false } = req.query
  if (isAll) {
    await destroyALLTokenOfUser(req.user.id)
  } else {
    await destroyToken(req.token.tokenCode)
  }
  return res.send({ message: 'Logout successfully' })
}

export const destroyAllTokenOfUser = async (userId) => {
  const queryData = await userTokenCollection()
    .where('userId', '==', userId)
    .get()
  queryData.docs.map((item) =>
    userTokenCollection()
      .doc(item.id)
      .update({
        isActive: false,
        updated: format('yyyy/MM/dd HH:mm:ss', new Date()),
      })
  )
  return queryData.empty
    ? ''
    : queryData.docs.map((item) =>
        userTokenCollection()
          .doc(item.id)
          .update({
            isActive: false,
            updated: format('yyyy/MM/dd HH:mm:ss', new Date()),
          })
      )
}

export const destroyToken = async (tokenFromClient) => {
  const queryData = await userTokenCollection()
    .where('tokenCode', '==', tokenFromClient)
    .get()
  return queryData.empty
    ? ''
    : queryData.docs.map((item) =>
        userTokenCollection().doc(item.id).update({
          isActive: false,
        })
      )
}
