import { projectCollection } from '@root/database'
export default async (req, res) => {
  const { projectId } = req.query
  try {
    const project = await projectCollection().doc(projectId).get()
    if (!project.exists) return res.sendStatus(404)
    return res.send(project.data())
  } catch (error) {
    return res.sendStatus(500)
  }
}
