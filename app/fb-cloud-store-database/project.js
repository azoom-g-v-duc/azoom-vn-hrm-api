const firebase = require('firebase')

const projectCollection = () => {
  return firebase.firestore().collection(process.env.DB_TABLE_PROJECT)
}

export const project = {
  id: '',
  projectName: '',
  createdUserId: '',
  startDate: '',
  endDate: '',
  status: -1,
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: ''
}

export const isValidProject = async data => {
  if (data.id && !(await getProject(data.id))) {
    return true
  }
  return false
}

export const saveProject = async data => {
  const project = await projectCollection()
    .doc(data.id)
    .set(data)
  return project
}

export const getProject = async projectId => {
  const queryData = await projectCollection()
    .where('id', '==', projectId)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}
