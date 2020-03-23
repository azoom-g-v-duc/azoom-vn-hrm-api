import {
  destroyToken,
  destroyALLTokenOfUser
} from '@cloudStoreDatabase/token-user'

  const { isAll = false } = req.query
  if (isAll) {
    await destroyALLTokenOfUser(req.user.id)
  } else {
    await destroyToken(req.token.tokenCode)
  }
