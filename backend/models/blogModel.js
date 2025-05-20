import db from '../config/db.js';

const Blog = {
  saveDraft: (data, callback) => {
  const { id, title, content, tags } = data;
  if (id) {
    db.query(
      'UPDATE blogs SET title = ?, content = ?, tags = ?, status = "draft", updated_at = NOW() WHERE id = ?',
      [title, content, tags, id],
      callback
    );
  } else {
    db.query(
      'INSERT INTO blogs (title, content, tags, status) VALUES (?, ?, ?, "draft")',
      [title, content, tags],
      callback
    );
  }
},


  publish: (data, callback) => {
  const { id, title, content, tags } = data;

  // ✅ Update ALL blogs with same title to published
  db.query(
    'UPDATE blogs SET content = ?, tags = ?, status = "published", updated_at = NOW() WHERE title = ?',
    [content, tags, title],
    (err, result) => {
      if (err) return callback(err);
      
      // ✅ If no rows matched (i.e., new blog), insert it
      if (result.affectedRows === 0) {
        db.query(
          'INSERT INTO blogs (title, content, tags, status) VALUES (?, ?, ?, "published")',
          [title, content, tags],
          callback
        );
      } else {
        // Return some fake result with existing id
        callback(null, { insertId: id || 0 });
      }
    }
  );
},

  getAll: (callback) => {
    db.query('SELECT * FROM blogs ORDER BY updated_at DESC', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM blogs WHERE id = ?', [id], callback);
  },

  getByTitle: (title, callback) => {
  db.query('SELECT * FROM blogs WHERE title = ?', [title], callback);
},

deleteById: (id, callback) => {
  db.query('DELETE FROM blogs WHERE id = ?', [id], callback);
}


};

export default Blog;
