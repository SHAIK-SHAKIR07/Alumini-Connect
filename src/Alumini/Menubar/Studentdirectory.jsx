import React, { useState } from 'react';
import './Studentdirectory.css';

const dummyStudents = [
  { id: 1, name: "Priya Sharma", course: "B.Tech Computer Science", year: "2024", email: "priya@example.com" },
  { id: 2, name: "Aman Verma", course: "BBA", year: "2023", email: "aman@example.com" },
  { id: 3, name: "Sana Khan", course: "BCA", year: "2025", email: "sana@example.com" },
];

const Studentdirectory = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [confirmation, setConfirmation] = useState('');

  const handleConnect = (student) => {
    setSelectedStudent(student);
    setConfirmation(`Connection request sent to ${student.name}`);
  };

  return (
    <div className="student-directory-container">
      <h2>Student Directory</h2>
      <p>Browse student profiles and connect with future professionals.</p>

      <div className="alumni-list">
        {dummyStudents.map(student => (
          <div key={student.id} className="alumni-card">
            <h3>{student.name}</h3>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Year:</strong> {student.year}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <button onClick={() => handleConnect(student)}>Connect</button>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div className="message-box">
          <p>{confirmation}</p>
        </div>
      )}
    </div>
  );
};

export default Studentdirectory;
