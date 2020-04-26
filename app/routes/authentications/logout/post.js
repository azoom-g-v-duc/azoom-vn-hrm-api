import { destroyToken, destroyALLTokenOfUser } from '@helpers/token-user'

export default async (req, res) => {
  const { isAll = false } = req.query
  if (isAll) {
    await destroyALLTokenOfUser(req.user.id)
  } else {
    await destroyToken(req.token.tokenCode)
  }
  return res.send({ message: 'Logout successfully' })
}
