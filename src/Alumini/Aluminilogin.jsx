import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Aluminilogin.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Aluminilogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const profileSnap = await getDoc(doc(db, 'users', user.uid));

      if (!profileSnap.exists()) {
        alert('Alumni profile not found. Please signup first.');
        setLoading(false);
        return;
      }

      const profileData = profileSnap.data();
      localStorage.setItem('user', JSON.stringify({ uid: user.uid, email: user.email, ...profileData }));
      navigate('/aldashboard');
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="alumini-login-container">
      <h1>Alumini Portal</h1>

      <form className="alumini-login-form" onSubmit={handleLogin}>
        <h2>Alumni Login</h2>
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

export default Aluminilogin;
