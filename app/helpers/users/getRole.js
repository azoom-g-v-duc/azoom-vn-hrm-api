export default async function (positionPermissionId = '') {
  return (
    {
      [process.env.POSITION_ADMIN]: 'admin',
      [process.env.POSITION_EDITOR]: 'editor',
      [process.env.POSITION_PROJECTMANAGER]: 'project manager',
      [process.env.POSITION_USER]: 'user',
    }[positionPermissionId] || ''
  )
}
