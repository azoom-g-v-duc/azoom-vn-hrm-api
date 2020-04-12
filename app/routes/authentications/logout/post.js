import {
  destroyToken,
  destroyALLTokenOfUser
} from '@cloudStoreDatabase/token-user'

export default async function (req, res) {
  const { isAll = false } = req.query
  if (isAll) {
    await destroyALLTokenOfUser(req.user.id)
  } else {
    await destroyToken(req.token.tokenCode)
  }
  return res.send({ message: 'Logout successfully' })
}
