import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function ToDo() {
  // Auth states
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [authError, setAuthError] = useState('');

  // Auth forms
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Task states
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskError, setTaskError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch tasks if logged in
  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  // Auth handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Login failed');
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: registerUsername, email: registerEmail, password: registerPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Registration failed');
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTasks([]);
  };

  // Task handlers
  const fetchTasks = async () => {
    setLoading(true);
    setTaskError('');
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch tasks');
      setTasks(data);
    } catch (err) {
      setTaskError(err.message);
    }
    setLoading(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setTaskError('');
    if (!newTask.trim()) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: newTask })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to add task');
      setTasks([...tasks, data]);
      setNewTask('');
    } catch (err) {
      setTaskError(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    setTaskError('');
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to delete task');
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      setTaskError(err.message);
    }
  };

  const handleEditTask = async (id, newText) => {
    setTaskError('');
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: newText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to update task');
      setTasks(tasks.map(t => t._id === id ? data : t));
    } catch (err) {
      setTaskError(err.message);
    }
  };

  // UI
  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {authError && <div style={{ color: 'red' }}>{authError}</div>}
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
            <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
            <button type="submit" style={{ width: '100%' }}>Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Username" value={registerUsername} onChange={e => setRegisterUsername(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
            <input type="email" placeholder="Email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
            <input type="password" placeholder="Password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
            <button type="submit" style={{ width: '100%' }}>Register</button>
          </form>
        )}
        <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: 10, width: '100%' }}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user?.username || user?.email}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <form onSubmit={handleAddTask} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          style={{ width: '80%', marginRight: 8 }}
        />
        <button type="submit">Add</button>
      </form>
      {taskError && <div style={{ color: 'red' }}>{taskError}</div>}
      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(task => (
            <TaskItem key={task._id} task={task} onDelete={handleDeleteTask} onEdit={handleEditTask} />
          ))}
        </ul>
      )}
    </div>
  );
}

function TaskItem({ task, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEdit = (e) => {
    e.preventDefault();
    onEdit(task._id, editText);
    setIsEditing(false);
  };

  return (
    <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
      {isEditing ? (
        <form onSubmit={handleEdit} style={{ flex: 1, display: 'flex' }}>
          <input
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            style={{ flex: 1, marginRight: 8 }}
          />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <span style={{ flex: 1 }}>{task.text}</span>
          <button onClick={() => setIsEditing(true)} style={{ marginRight: 8 }}>Edit</button>
        </>
      )}
      <button onClick={() => onDelete(task._id)} style={{ color: 'red' }}>Delete</button>
    </li>
  );
}

export default ToDo;
