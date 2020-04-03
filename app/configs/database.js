const firebase = require('firebase')

export const getTable = tableName => {
  return firebase.firestore().collection(tableName)
}
