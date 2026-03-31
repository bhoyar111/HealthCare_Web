import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Productvideos.css';

const API_BASE_URL = process.env.REACT_APP_VIDEO_API_URL || 'http://localhost:8083';
console.log('API_BASE_URL:', API_BASE_URL);

function Productvideos() {
  const [hasAccess, setHasAccess] = useState(null);
  const [authUrl, setAuthUrl] = useState('');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true);
      const res = await axios.get(`${API_BASE_URL}/api/upload/videos`);
      setUploadedVideos(res.data || []);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError('Failed to load videos: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoadingVideos(false);
    }
  };

  const checkAccess = async () => {
    try {
      setCheckingAccess(true);
      const res = await axios.get(`${API_BASE_URL}/api/upload/check-access?email=yaminimirashe20@gmail.com`);
      setHasAccess(res.data.hasAccess);
      if (res.data.hasAccess) {
        fetchVideos();
      }
    } catch (err) {
      setHasAccess(false);
    } finally {
      setCheckingAccess(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getAuthUrl = async () => {
    try {
      setMessage('Fetching authentication link...');
      const res = await axios.get(`${API_BASE_URL}/api/auth/google`);
      setAuthUrl(res.data.url);
      setMessage('Ready! Click below to sign in with Google.');
    } catch (err) {
      setError('Failed to get login link: ' + (err.response?.data || err.message));
    }
  };

  const startGoogleAuth = () => {
    if (authUrl) {
      window.open(authUrl, '_blank', 'width=500,height=700');
      setMessage('Authentication window opened. Complete sign-in, then return here.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      setMessage(`Selected: ${e.dataTransfer.files[0].name}`);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(`Selected: ${e.target.files[0].name}`);
    }
  };

  const uploadVideo = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setError('Please select a video and enter a title.');
      return;
    }

    setUploading(true);
    setMessage('Uploading to YouTube... This may take a while.');
    setError('');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('userEmail', 'yaminimirashe20@gmail.com');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(`Success! Video uploaded: https://youtu.be/${res.data.videoId}`);
      setFile(null);
      setTitle('');
      setDescription('');
      document.getElementById('file-input').value = '';
      fetchVideos();
    } catch (err) {
      if (err.response?.data?.needsAuth) {
        setHasAccess(false);
        setError('Authentication required. Please sign in with Google.');
      } else {
        setError('Upload failed: ' + (err.response?.data?.error || err.message));
      }
    } finally {
      setUploading(false);
    }
  };



  if (checkingAccess) {
    return (
      <div className="app-container">
        <header className="header">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png" alt="YouTube" className="youtube-logo" />
          <h1>YouTube Video Uploader</h1>
          <p>Checking access...</p>
        </header>
        <div className="main-card">
          <div className="section-card">
            <p>🔍 Checking your access to upload videos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Video Uploader</h1>
      </header>
      <div className="main-card">
        {/* Conditional Auth Section - Only show if no access */}
        {hasAccess === false && (
          <div className="section-card">
            <h2>🔐 Authentication Required</h2>
            <p>Sign in with Google to upload videos to your YouTube channel.</p>
            {!authUrl ? (
              <button onClick={getAuthUrl} className="btn-outline">Get Sign-In Link</button>
            ) : (
              <button onClick={startGoogleAuth} className="btn-google">
                <svg viewBox="0 0 48 48" width="20" height="20"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.91 2.35 13.95l8.05 6.25C12.4 13.92 17.82 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.4 28.8c-.93-2.78-1.45-5.76-1.45-8.8 0-3.04.52-6.02 1.45-8.8l-8.05-6.25C.94 9.02 0 16.33 0 24c0 7.67.94 14.98 2.72 20.05l8.68-6.75z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-8.68 6.75C9.55 42.44 16.38 48 24 48z"></path></svg>
                Sign in with Google
              </button>
            )}
            <p><small>After signing in, return here and refresh the page.</small></p>
          </div>
        )}

        {/* Upload Section - Show if has access */}
        {hasAccess && (
          <div className="section-card">
            <h2>📹 Upload New Video</h2>
            <form onSubmit={uploadVideo}>
              <div className={`drop-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                <input id="file-input" type="file" accept="video/*" onChange={handleFileChange} hidden />
                <p>Drag & drop video here, or <label htmlFor="file-input" className="browse-link">browse</label></p>
                {file && <p className="file-name">Selected: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
              </div>

              <div className="input-group">
                <label>Title <span className="required">*</span></label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter video title" required />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your video..." rows="3" />
              </div>

              <button type="submit" disabled={uploading} className="btn-upload">
                {uploading ? 'Uploading... ⏳' : 'Upload to YouTube'}
              </button>
            </form>
          </div>
        )}

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
      </div>

      {/* Uploaded Videos Gallery - Only show if has access */}
      {hasAccess && (
        <div className="gallery-section">
          <h2>Your Uploaded Videos</h2>
          {loadingVideos ? (
            <p>Loading videos...</p>
          ) : uploadedVideos.length === 0 ? (
            <p>No videos uploaded yet. Upload your first one above! 🎥</p>
          ) : (
            <div className="video-grid">
              {uploadedVideos.map((video) => (
                <div key={video._id} className="video-card">
                  <div className="embed-container">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    {video.description && <p>{video.description}</p>}
                    <a href={`https://youtu.be/${video.videoId}`} target="_blank" rel="noopener noreferrer" className="watch-link">
                      Watch on YouTube →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer>
        <p>Backend: {API_BASE_URL} • Videos are embedded securely via YouTube</p>
        {hasAccess && <p>✅ Authenticated and ready to upload</p>}
      </footer>
    </div>
  );
}

export default Productvideos;


