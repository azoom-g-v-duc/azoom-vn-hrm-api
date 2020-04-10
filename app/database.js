const firebase = require('firebase')

firebase.initializeApp({
  apiKey: process.env.FIRE_BASE_API_KEY,
  authDomain: process.env.FIRE_BASE_AUTH_DOMAIN,
  databaseURL: process.env.FIRE_BASE_DATABASE_URL,
  projectId: process.env.FIRE_BASE_PROJECT_ID,
  storageBucket: process.env.FIRE_BASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIRE_BASE_MESSAGING_SENDER_ID,
  appId: process.env.FIRE_BASE_APP_ID,
})

const fireStore = firebase.firestore()

<<<<<<< HEAD
export const leaveApplicationCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_LEAVE_APPLICATION)
=======
export const timesheetApplicationCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_TIME_SHEET_APPLICATION)
>>>>>>> :+1:  Implement approve/reject timesheet application API
}

export const projectCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_PROJECT)
}

<<<<<<< HEAD
export const timesheetCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_TIME_SHEET_APPLICATION)
}

=======
>>>>>>> :+1:  Implement approve/reject timesheet application API
export const userCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_USER)
}

<<<<<<< HEAD
export const userTokenCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_USER_TOKEN)
}

export const timesheetApplicationCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_TIME_SHEET_APPLICATION)
=======
export const timesheetCollection = () => {
  return fireStore.collection(process.env.DB_TABLE_TIME_SHEET)
>>>>>>> :+1:  Implement approve/reject timesheet application API
}
