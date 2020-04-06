const firebase = require('firebase')

export const positionPermission = {
  id: '',
  name: ''
}

const possitionPermissionCollection = () => {
  return firebase
    .firestore()
    .collection(process.env.DB_TABLE_POSITION_PERMISSION)
}

export const savePositionPermission = async data => {
  const positionPermission = await possitionPermissionCollection()
    .doc(data.id)
    .set(data)
  return positionPermission
}
