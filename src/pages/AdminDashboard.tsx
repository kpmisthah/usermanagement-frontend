import { useEffect, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { AppDispatch, RootState } from '../app/store'; 
import { getAllUsers, createNewUser, editUser, removeUser } from '../features/admin/adminSlice'; 
import UserTable from '../components/admin/UserTable';
import UserForm from '../components/admin/UserForm';
import '../../public/AdminDashboard.css'
interface User {   
  id: number;   
  username: string;   
  email: string;   
  role?: string;
}


const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User|null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers(search));
  }, [dispatch, search]);

  const handleCreate = async (data: any) => {
    await dispatch(createNewUser(data));
    setShowForm(false);
  };

  const handleEdit = async (id: number, data: any) => {
    await dispatch(editUser({ id, data }));
    setEditingUser(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(removeUser(id));
    }
  };

  const closeModal = () => {
    setEditingUser(null);
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      
      <div className="dashboard-header">
        <input
          type="text"
          placeholder="Search by username or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {!showForm && (
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(true)}
            style={{ marginBottom: '1rem' }}
          >
            Add New User
          </button>
        )}
      </div>
      
      {showForm && (
        <UserForm 
          onSubmit={handleCreate} 
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading user data...</span>
        </div>
      ) : (
        <UserTable
          users={users}
          onEdit={setEditingUser}
          onDelete={handleDelete}
        />
      )}

      {editingUser && (
        <div className="modal">
          <UserForm
            user={editingUser}
            onSubmit={(data:any) => handleEdit(editingUser.id, data)}
            onCancel={closeModal}
          />
        </div>
      )}
      
    </div>
  );
};

export default AdminDashboard;