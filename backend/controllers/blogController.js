import Blog from '../models/blogModel.js';

export const saveDraft = (req, res) => {
  Blog.saveDraft(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId || req.body.id });
  });
};

export const publish = (req, res) => {
  Blog.publish(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId || req.body.id });
  });
};

export const getAll = (req, res) => {
  Blog.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

export const getById = (req, res) => {
  Blog.getById(req.params.id, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  });
};

export const checkDuplicate = (req, res) => {
  const { title } = req.body;
  Blog.getByTitle(title, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ exists: rows.length > 0, existingBlog: rows[0] || null });
  });
};

export const deleteBlog = (req, res) => {
  const { id } = req.params;
  Blog.deleteById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};


