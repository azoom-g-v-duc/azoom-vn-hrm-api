const firebase = require('firebase')
let database = ''
export const getDatabase = () => {
  const firebaseConfig = {
    apiKey: process.env.FIRE_BASE_API_KEY,
    authDomain: process.env.FIRE_BASE_AUTH_DOMAIN,
    databaseURL: process.env.FIRE_BASE_DATABASE_URL,
    projectId: process.env.FIRE_BASE_PROJECT_ID,
    storageBucket: process.env.FIRE_BASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIRE_BASE_MESSAGING_SENDER_ID,
    appId: process.env.FIRE_BASE_APP_ID
  }
  firebase.initializeApp(firebaseConfig)
  return firebase.firestore()
}
export const initTable = () => {}

export const getTable = tableName => {
  if (!database) {
    database = getDatabase()
  }
  return database.collection(tableName)
}
export const InsertData = (tableName, docId, data) => {
  if (!database) {
    database = getDatabase()
  }
  return database
    .collection(tableName)
    .doc(docId)
    .set(data)
}
export const UpdateData = (tableName, docId, data) => {
  if (!database) {
    database = getDatabase()
  }
  return database
    .collection(tableName)
    .doc(docId)
    .update(data)
}
