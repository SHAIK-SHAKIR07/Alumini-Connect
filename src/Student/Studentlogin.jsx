import React, { useState } from 'react';
import './Studentlogin.css';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Studentlogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const profileSnap = await getDoc(doc(db, 'users', user.uid));

      if (!profileSnap.exists()) {
        alert('Student profile not found. Please signup first.');
        setLoading(false);
        return;
      }

      const profileData = profileSnap.data();
      localStorage.setItem('user', JSON.stringify({ uid: user.uid, email: user.email, ...profileData }));
      navigate('/studentmenu');
    } catch (error) {
      console.error('Login Error:', error);
      alert(error.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="student-login-container">
      <h1>Student Portal</h1>
      <form className="student-login-form" onSubmit={handleSubmit}>
        <h2>Student Login</h2>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Studentlogin;
