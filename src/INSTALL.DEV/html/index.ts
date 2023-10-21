import hogan from 'hogan.js'
import mongoose from 'mongoose'
import Config from '../../config'

/** Kept as an example use of hogan.js @deprecated */
export async function dev_install_form_summary() {
  await mongoose.connect(Config.DB_URI)
  const annotationCount = await mongoose.connection.db.collection('annotations')
    .countDocuments() || 'empty'
  const userCount = await mongoose.connection.db.collection('users')
    .countDocuments() || 'empty'
  // await mongoose.disconnect()

  return hogan.compile(`
    <p>
      <em>Use these shortcuts to quickly test the application.</em>
      <em>These shortcuts are not available in production.</em>
    </p>
    <h3>Collections</h3>
    <p>
      &#128172;<span style="color:#0074d8"><b>Annotations</b></span> <em>({{ annotationCount }})</em>
      <br />
      &#128526;<span style="color:#0074d8"><b>Users</b></span> <em>({{ userCount }})</em>
    </p>
  `).render({ annotationCount, userCount })
}
