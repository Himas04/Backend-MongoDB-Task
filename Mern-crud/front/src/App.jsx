import React, { useState, useEffect } from 'react';

// Backend Server URL
const API_URL = 'http://localhost:5050/api/students';

export default function App() {
  // 1. States to manage form fields and student list
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [course, setCourse] = useState('');
  const [editId, setEditId] = useState(null);

  // 2. READ: Fetch all student records from backend
  const fetchStudents = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 3. POST & PUT: Add new student or Update existing student
  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentData = { name, email, age, course };

    if (editId) {
      // UPDATE (PUT request)
      await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      alert('Student updated successfully!');
    } else {
      // CREATE (POST request)
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      alert('Student added successfully!');
    }

    // Reset form fields and reload student list
    setName(''); setEmail(''); setAge(''); setCourse(''); setEditId(null);
    fetchStudents();
  };

  // 4. Fill form fields with selected student details for Editing
  const handleEdit = (student) => {
    setEditId(student._id);
    setName(student.name);
    setEmail(student.email);
    setAge(student.age);
    setCourse(student.course);
  };

  // 5. DELETE: Delete a student record
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStudents(students.filter(student => student._id !== id));
        alert('Student deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div className="container">
      <h1>Simple MERN CRUD App</h1>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <h3>{editId ? 'Edit Student' : 'Add Student'}</h3>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
        <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} required />
        
        <button type="submit" className={editId ? 'btn-update' : 'btn-add'}>
          {editId ? 'Update' : 'Add'}
        </button>
      </form>

      {/* Student List Table Section */}
      <h2>Student List ({students.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>
              <td>
                <button type="button" onClick={() => handleEdit(student)} className="btn-edit">Edit</button>
                <button type="button" onClick={() => handleDelete(student._id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
