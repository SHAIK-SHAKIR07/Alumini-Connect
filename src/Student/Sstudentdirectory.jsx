import React, { useState, useEffect } from 'react';
import './Sstudentdirectory.css';
import { getAllUsers, sendAlumniRequest } from '../services/userService';
import { auth } from '../firebase';

const initialStudent = JSON.parse(localStorage.getItem('user') || 'null');

const Sstudentdirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [selectedAlum, setSelectedAlum] = useState(null);
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState({});

  useEffect(() => {
    const loadAlumni = async () => {
      try {
        const alumniList = await getAllUsers();
        setAlumni(alumniList);
      } catch (err) {
        console.error('Failed to load alumni:', err);
      }
    };

    loadAlumni();
  }, []);

  const studentProfile = initialStudent || { uid: '', email: '', fullName: 'Student' };

  const handleSendRequest = async () => {
    if (!selectedAlum || !message.trim()) {
      return;
    }

    if (!studentProfile.uid) {
      alert('Please login as a student first.');
      return;
    }

    if (!auth.currentUser) {
      alert('Your Firebase session has expired. Please login again.');
      return;
    }

    if (auth.currentUser.uid !== studentProfile.uid) {
      alert('Student login mismatch. Please re-login to continue.');
      return;
    }

    setLoading(true);

    try {
      const alumniUid = selectedAlum.id || selectedAlum.uid;
      if (!alumniUid) {
        alert('Please select a valid alumni profile first.');
        return;
      }

      await sendAlumniRequest({
        studentUid: studentProfile.uid,
        studentName: studentProfile.fullName || 'Student',
        studentEmail: studentProfile.email,
        alumniUid,
        alumniName: selectedAlum.fullName || selectedAlum.name || 'Alumni',
        message: message.trim(),
      });

      setRequests(prev => ({
        ...prev,
        [alumniUid]: [
          ...(prev[alumniUid] || []),
          { text: message.trim(), createdAt: new Date().toLocaleString() }
        ]
      }));
      setConfirmation(`Request sent to ${selectedAlum.fullName || selectedAlum.name}`);
      setMessage('');
    } catch (err) {
      console.error('Send request failed:', err);
      alert(err?.message || 'Unable to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-directory-page">
      <h2>Alumni Directory</h2>
      <p>Browse alumni profiles and send a connection request.</p>

      <div className="directory-grid">
        <div className="directory-list">
          {alumni.length === 0 ? (
            <div className="empty-state">No alumni are available yet.</div>
          ) : (
            alumni.map(alum => (
              <div
                key={alum.id}
                className={`directory-card ${selectedAlum?.id === alum.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedAlum(alum);
                  setConfirmation('');
                  setMessage('');
                }}
              >
                <h3>{alum.fullName || alum.name}</h3>
                <p><strong>Role:</strong> {alum.currentRole || alum.role || 'N/A'}</p>
                <p><strong>Company:</strong> {alum.companyName || alum.company || 'N/A'}</p>
                <p><strong>Location:</strong> {alum.location || alum.collegeName || 'N/A'}</p>
              </div>
            ))
          )}
        </div>

        {selectedAlum && (
          <div className="request-panel">
            <h3>Send request to {selectedAlum.fullName || selectedAlum.name}</h3>
            <textarea
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write your request message..."
            />
            <button onClick={handleSendRequest} disabled={loading || !message.trim() || !selectedAlum}>
              {loading ? 'Sending...' : 'Send Request'}
            </button>
            {confirmation && <p className="request-confirmation">{confirmation}</p>}

            <div className="request-history">
              <h4>Sent Requests</h4>
              {(!requests[selectedAlum.id] || requests[selectedAlum.id].length === 0) ? (
                <p>No requests sent yet.</p>
              ) : (
                <ul>
                  {requests[selectedAlum.id].map((req, idx) => (
                    <li key={idx}>
                      <span>{req.text}</span>
                      <br />
                      <small>{req.createdAt}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sstudentdirectory;
