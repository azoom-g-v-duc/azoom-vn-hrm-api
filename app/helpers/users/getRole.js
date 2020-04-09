import getUser from '@routes/users/_userId/get.js'
import { execute } from '@root/util.js'

export default async function (userId) {
  const user = await execute(getUser, { params: { userId } })
  if (!user) return ''

  return (
    {
      [process.env.POSITION_ADMIN]: 'admin',
      [process.env.POSITION_EDITOR]: 'editor',
      [process.env.POSITION_PROJECTMANAGER]: 'project manager',
      [process.env.POSITION_USER]: 'user',
    }[user.positionPermissionId] || ''
  )
}
