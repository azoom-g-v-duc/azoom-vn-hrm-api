import { userTokenCollection } from '@root/database'

export default async function getToken(userId, tokenFromClient) {
  const queryData = await userTokenCollection()
    .where('tokenCode', '==', tokenFromClient)
    .where('userId', '==', userId)
    .where('isActive', '==', true)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}
