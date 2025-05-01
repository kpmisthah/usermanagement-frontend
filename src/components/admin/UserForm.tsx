import { useState, useEffect } from 'react';

const UserForm = ({ user = null, onSubmit }: any) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ username: '', email: '', role: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input name="role" value={form.role} onChange={handleChange} placeholder="Role" required />
      <button type="submit">{user ? 'Update' : 'Create'} User</button>
    </form>
  );
};

export default UserForm;
