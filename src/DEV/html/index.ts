import mongoose from 'mongoose';

/** Development utility for showing database collection counts */
export async function dev_install_form_summary() {
  const bookmarkCount = await mongoose.connection.db?.collection('bookmarks')
    .countDocuments() || 'empty';
  const userCount = await mongoose.connection.db?.collection('users')
    .countDocuments() || 'empty';

  return `
    <p>
      <em>Use these shortcuts to quickly test the application.</em>
      <em>These shortcuts are not available in production.</em>
    </p>
    <h3>Collections</h3>
    <p>
      &#128172;<span style="color:#0074d8"><b>Bookmarks</b></span> <em>(${bookmarkCount})</em>
      <br />
      &#128526;<span style="color:#0074d8"><b>Users</b></span> <em>(${userCount})</em>
    </p>
  `;
}
