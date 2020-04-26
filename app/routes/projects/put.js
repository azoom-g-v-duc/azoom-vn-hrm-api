import { projectCollection } from '@root/database'

export default async (req, res) => {
  const data = req.body
  await projectCollection().doc(data.id).set(data)
  res.send(data)
}
