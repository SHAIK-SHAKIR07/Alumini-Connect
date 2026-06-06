import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Studentlogin.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Studentsignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    regdNumber: '',
    collegeName: '',
    batch: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        regdNumber: formData.regdNumber,
        collegeName: formData.collegeName,
        batch: formData.batch,
        typeOfUser: 'student',
        createdAt: new Date()
      });

      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        fullName: formData.fullName,
        regdNumber: formData.regdNumber,
        collegeName: formData.collegeName,
        batch: formData.batch,
        typeOfUser: 'student'
      }));
      navigate('/studentmenu');
    } catch (err) {
      console.error('Signup Error:', err);
      alert(err.message || 'Something went wrong. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="student-login-container">
      <h1>Student Portal</h1>
      <form className="student-login-form" onSubmit={handleSubmit}>
        <h2>Student Signup</h2>
        <input type="text" name="fullName" placeholder="Full Name" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} />
        <input type="text" name="regdNumber" placeholder="Regd Number" required onChange={handleChange} />
        <input type="text" name="collegeName" placeholder="College Name" required onChange={handleChange} />
        <input type="text" name="batch" placeholder="Batch (e.g., 2022–2026)" required onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
};

export default Studentsignup;
