import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function BlogList({ blogs, onSelect, hideEmptyText = false, onDelete }) {
  if (!blogs.length && hideEmptyText) return null;

  return (
    <div className="blog-list">
      {blogs.length === 0 && <p>No blogs found.</p>}
      {blogs.map((b) => (
        <div key={b.id} className="blog-item">
          <div className="blog-title" onClick={() => onSelect(b)}>
            <strong>{b.title || '(Untitled)'}</strong>
            {b.status === 'draft' && ' (Draft)'}
          </div>

          <div className="blog-actions">
            <span className="edit-icon" onClick={() => onSelect(b)} title="Edit">
              <FontAwesomeIcon icon={faPenToSquare} />
            </span>
            <span className="delete-icon" onClick={() => onDelete(b.id)} title="Delete">
               <FontAwesomeIcon icon={faTrash} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
