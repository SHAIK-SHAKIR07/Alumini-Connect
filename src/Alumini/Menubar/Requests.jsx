import React, { useEffect, useState } from 'react';
import { getRequestsForAlumni, updateRequestStatus } from '../../services/userService';
import './Studentdirectory.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const alumniUid = currentUser?.uid;

  useEffect(() => {
    const load = async () => {
      if (!alumniUid) {
        setLoading(false);
        return;
      }
      try {
        const data = await getRequestsForAlumni(alumniUid);
        setRequests(data);
      } catch (err) {
        console.error('Failed to load requests', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [alumniUid]);

  const handleUpdate = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      setRequests(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    } catch (err) {
      console.error('Failed to update request', err);
      alert('Unable to update. Try again.');
    }
  };

  if (!alumniUid) return <div className="student-directory-container"><p>Please login as an alumni to view requests.</p></div>;

  return (
    <div className="student-directory-container">
      <h2>Incoming Requests</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <div>
          {requests.map(req => (
            <div key={req.id} className="alumni-card" style={{ marginBottom: 12 }}>
              <h3>{req.studentName}</h3>
              <p>{req.message}</p>
              <small>From: {req.studentEmail} • {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleString() : (req.createdAt || '')}</small>
              <p>Status: <strong>{req.status}</strong></p>
              {req.status === 'pending' && (
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => handleUpdate(req.id, 'accepted')} style={{ marginRight: 8 }}>Accept</button>
                  <button onClick={() => handleUpdate(req.id, 'rejected')}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
