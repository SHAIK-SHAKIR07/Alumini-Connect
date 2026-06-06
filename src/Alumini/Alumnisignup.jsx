import React, { useState } from 'react';
import './Alumnisignup.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Alumnisignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    regdNumber: '',
    collegeName: '',
    batch: '',
    currentRole: '',
    companyName: ''
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
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save profile to Firestore
      const profileData = {
        fullName: formData.fullName,
        email: formData.email,
        regdNumber: formData.regdNumber,
        collegeName: formData.collegeName,
        batch: formData.batch,
        currentRole: formData.currentRole,
        companyName: formData.companyName,
        typeOfUser: 'alumni',
        createdAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), profileData);

      localStorage.setItem('user', JSON.stringify({ uid: user.uid, ...profileData }));
      window.location.href = '/aldashboard';
    } catch (err) {
      console.error("Signup Error:", err);
      alert(err.message || "Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="alumni-signup-container">
      <h1>Alumni Signup</h1>

      <form className="alumni-signup-form" onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} />
        <input type="text" name="regdNumber" placeholder="Regd Number" required onChange={handleChange} />
        <input type="text" name="collegeName" placeholder="College Name" required onChange={handleChange} />
        <input type="text" name="batch" placeholder="Batch (e.g., 2018–2022)" required onChange={handleChange} />
        <input type="text" name="currentRole" placeholder="Role (e.g., Developer)" required onChange={handleChange} />
        <input type="text" name="companyName" placeholder="Company Name" required onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
};

export default Alumnisignup;
