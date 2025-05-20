import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { RichTextEditor } from '@mantine/rte';

export default function BlogEditor({ blog, onSave, onPublish, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const saveTimeout = useRef(null);
  const lastSavedId = useRef(null);
  const lastSavedData = useRef({ title: '', content: '', tags: '' });

  // Load from blog prop or localStorage
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || '');
      setContent(blog.content || '');
      setTags(blog.tags || '');
      lastSavedId.current = blog.id || null;
      lastSavedData.current = {
        title: blog.title || '',
        content: blog.content || '',
        tags: blog.tags || ''
      };
    } else {
      const saved = JSON.parse(localStorage.getItem('temp-blog-draft')) || {};
      setTitle(saved.title || '');
      setContent(saved.content || '');
      setTags(saved.tags || '');
      lastSavedId.current = null;
      lastSavedData.current = {
        title: saved.title || '',
        content: saved.content || '',
        tags: saved.tags || ''
      };
    }
  }, [blog]);

  useEffect(() => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const trimmedTags = tags.trim();

    const isEmpty = !trimmedTitle && !trimmedContent && !trimmedTags;
    const isSameAsLast = (
      title === lastSavedData.current.title &&
      content === lastSavedData.current.content &&
      tags === lastSavedData.current.tags
    );

    // ⛔ Don't save if it's empty or hasn't changed
    if (isEmpty || isSameAsLast) {
      return;
    }

    // 🧠 Save to localStorage temporarily in case of refresh
    localStorage.setItem('temp-blog-draft', JSON.stringify({ title, content, tags }));

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      const saveDraft = async () => {
        const allFieldsEmpty = !title.trim() && !content.trim() && !tags.trim();
        if (allFieldsEmpty) return;

        setSaving(true);
        try {
          const payload = { id: lastSavedId.current, title, content, tags };
          const res = await axios.post('http://localhost:5000/blogs/save-draft', payload);
          if (res.data.success) {
            lastSavedId.current = res.data.id;
            lastSavedData.current = { title, content, tags };
            onSave && onSave({ id: res.data.id, title, content, tags, status: 'draft' });
            setSavedMessage('Draft saved ✔️');
            setTimeout(() => setSavedMessage(''), 2000);
            localStorage.removeItem('temp-blog-draft');
          }
        } catch (err) {
          console.error('Auto-save failed', err);
        } finally {
          setSaving(false);
        }
      };

      saveDraft();
    }, 5000);

    return () => clearTimeout(saveTimeout.current);
  }, [title, content, tags, onSave]);

  const manualSaveDraft = async () => {
    const isEmpty = !title.trim() && !content.trim() && !tags.trim();
    if (isEmpty) {
      setSavedMessage('Nothing to save');
      setTimeout(() => setSavedMessage(''), 2000);
      return;
    }

    try {
      setSaving(true);
      const payload = { id: lastSavedId.current, title, content, tags };
      const res = await axios.post('http://localhost:5000/blogs/save-draft', payload);
      if (res.data.success) {
        lastSavedId.current = res.data.id;
        lastSavedData.current = { title, content, tags };
        onSave && onSave({ id: res.data.id, title, content, tags, status: 'draft' });
        setSavedMessage('Draft saved ✔️');
        setTimeout(() => setSavedMessage(''), 2000);
        localStorage.removeItem('temp-blog-draft');
      }
    } catch (err) {
      console.error('Manual draft save failed', err);
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and Content are required');
      return;
    }

    const payload = { title, content, tags };
    if (lastSavedId.current) {
      payload.id = lastSavedId.current;
    }

    try {
      const res = await axios.post('http://localhost:5000/blogs/publish', payload);
      if (res.data.success) {
        onPublish && onPublish();
        setTitle('');
        setContent('');
        setTags('');
        lastSavedId.current = null;
        lastSavedData.current = { title: '', content: '', tags: '' };
        localStorage.removeItem('temp-blog-draft');
      }
    } catch (err) {
      console.error('Publish failed', err);
    }
  };

  return (
    <div className="editor" style={{ maxWidth: '900px', margin: 'auto', width: '100%' }}>
      {lastSavedId.current && (
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={() => {
              setTitle('');
              setContent('');
              setTags('');
              lastSavedId.current = null;
              lastSavedData.current = { title: '', content: '', tags: '' };
              localStorage.removeItem('temp-blog-draft');
              onCancel && onCancel();
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: 'red',
              marginBottom: '10px'
            }}
          >
            ❌ Cancel Editing
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: '97%',
          padding: '12px',
          marginBottom: '10px',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--input-bg)',
          color: 'var(--input-text)'
        }}
      />

      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Write your blog content here..."
        style={{
          width: '97%',
          minHeight: '400px',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--input-bg)',
          color: 'var(--input-text)'
        }}
      />

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        style={{
          width: '97%',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--input-bg)',
          color: 'var(--input-text)'
        }}
      />

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={manualSaveDraft}
          style={{
            backgroundColor: '#1abc9c',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            fontWeight: 'bold'
          }}
        >
          Save Draft
        </button>

        <button
          onClick={publish}
          style={{
            backgroundColor: '#2ecc71',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            fontWeight: 'bold'
          }}
        >
          Publish
        </button>

        {saving && <span style={{ color: '#888' }}>Saving...</span>}
        {!saving && savedMessage && (
          <span style={{ color: savedMessage === 'Nothing to save' ? '#ff6b6b' : 'green' }}>
            {savedMessage}
          </span>
        )}
      </div>
    </div>
  );
}
