export const positionPermission = {
  id: '',
  name: ''
}

export const savePositionPermission = async data => {
  const positionPermission = await getTable(
    process.env.DB_TABLE_POSITION_PERMISSION
  )
    .doc(data.id)
    .set(data)
  return positionPermission
}

// export const getRole = async roleId => {
//   const queryData = await getTable(process.env.DB_TABLE_POSITION_PERMISSION)
//     .where('id', '==', roleId)
//     .get()
//   return queryData.empty ? '' : queryData.docs[0].data()
// }
