import { useState, useEffect } from 'react';

// const UserForm = ({ user = null, onSubmit }: any) => {
//   const [form, setForm] = useState({
//     username: '',
//     email: '',
//     role: '',
//   });

//   useEffect(() => {
//     if (user) {
//       setForm(user);
//     }
//   }, [user]);

//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     onSubmit(form);
//     setForm({ username: '', email: '', role: '' });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="user-form">
//       <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
//       <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
//       <input name="role" value={form.role} onChange={handleChange} placeholder="Role" required />
//       <button type="submit">{user ? 'Update' : 'Create'} User</button>
//     </form>
//   );
// };

// export default UserForm;

// UserForm Component
const UserForm = ({ user, onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || 'User',
    password:''
  });
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '', 
        role: user.role,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!user) {
      setFormData({ username: '', email: '',  role: 'user',password:'' });
    }
  };

  return (
    <div className="user-form">
      {user ? (
        <div className="modal-header">
          <h3>Edit User</h3>
          {onCancel && (
            <button className="close-btn" onClick={onCancel}>×</button>
          )}
        </div>
      ) : (
        <h3>Add New User</h3>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {!user && ( 
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="User">user</option>
            <option value="Admin">admin</option>
          </select>
        </div>
        
        <div className="form-actions">
          {onCancel && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {user ? 'Update User' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default UserForm