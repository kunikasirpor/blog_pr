import React, { useState, useEffect } from 'react';
import BlogEditor from './components/BlogEditor';
import BlogList from './components/BlogList';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import Login from './components/Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import './App.css';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [view, setView] = useState('editor');
  const [showConfirm, setShowConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading

  // Check login status on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/check', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.loggedIn) {
          setIsLoggedIn(true);
          fetchBlogs();
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Login check failed:', err);
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/blogs', {
        credentials: 'include',
      });
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error('Fetching blogs failed:', err);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  const handleDraftClick = (blog) => {
    setSelectedBlog(blog);
    setView('editor');
  };

  const handlePublishedClick = (blog) => {
    setSelectedBlog(blog);
    setView('editor');
  };

  const handleDelete = (id) => {
    setBlogToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5000/blogs/${blogToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      showToast('Blog deleted!');
      fetchBlogs();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setShowConfirm(false);
      setBlogToDelete(null);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    fetchBlogs();
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsLoggedIn(false); // This will show the <Login /> again
      setSelectedBlog(null);
      setBlogs([]);
      setView('editor');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (isLoggedIn === null) return <div>Loading...</div>;

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: 'fixed',
          top: 20,
          right: 60,
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          fontSize: '26px',
          color: darkMode ? '#3b82f6' : '#f59e0b',
        }}
        aria-label="Toggle dark mode"
      >
        <FontAwesomeIcon icon={faCircleHalfStroke} />
      </button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          fontSize: '26px',
          color: darkMode ? '#f87171' : '#dc2626',
        }}
        title="Logout"
        aria-label="Logout"
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
      </button>

      <h1>
        {view === 'drafts' ? 'Drafts' :
         view === 'published' ? 'Posts' :
         'Blog Editor'}
      </h1>

      {/* Blog Editor */}
      {view === 'editor' && (
        <>
          <BlogEditor
            blog={selectedBlog}
            onSave={() => {
              setSelectedBlog(null);
              showToast('Draft saved!');
              fetchBlogs();
            }}
            onPublish={() => {
              setSelectedBlog(null);
              showToast('Blog published!');
              fetchBlogs();
            }}
            onCancel={() => setSelectedBlog(null)}
          />
          <div className="view-buttons">
            <button onClick={() => setView('drafts')} className="show-drafts-btn">Show Drafts</button>
            <button onClick={() => setView('published')} className="show-published-btn">Show Published</button>
          </div>
        </>
      )}

      {/* Drafts View */}
      {view === 'drafts' && (
        <>
          <button onClick={() => setView('editor')} className="back-btn" style={{ marginBottom: '15px' }}>
            ⬅ Back to Editor
          </button>
          <BlogList
            blogs={blogs.filter((b) => b.status === 'draft')}
            onSelect={handleDraftClick}
            onDelete={handleDelete}
            hideEmptyText
          />
        </>
      )}

      {/* Published View */}
      {view === 'published' && (
        <>
          <button onClick={() => setView('editor')} className="back-btn" style={{ marginBottom: '15px' }}>
            ⬅ Back to Editor
          </button>
          <BlogList
            blogs={blogs.filter((b) => b.status === 'published')}
            onSelect={handlePublishedClick}
            onDelete={handleDelete}
            hideEmptyText
          />
        </>
      )}

      {/* Toast and Confirmation Modal */}
      {toastMsg && <Toast message={toastMsg} />}
      <ConfirmModal
        show={showConfirm}
        message="Are you sure you want to delete this permanently?"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

export default App;
