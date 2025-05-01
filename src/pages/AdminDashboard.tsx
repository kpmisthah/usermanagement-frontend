import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { getAllUsers, createNewUser, editUser, removeUser } from '../features/admin/adminSlice';
import UserTable from '../components/admin/UserTable';
import UserForm from '../components/admin/UserForm';
interface User {
  id: number;
  username: string;
  email: string;
  // Add other properties if needed
}

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User|null>(null);

  useEffect(() => {
    dispatch(getAllUsers(search));
  }, [dispatch, search]);

  const handleCreate = async (data: any) => {
    await dispatch(createNewUser(data));
  };

  const handleEdit = async (id: number, data: any) => {
    await dispatch(editUser({ id, data }));
    setEditingUser(null);
  };

  const handleDelete = (id: number) => {
    dispatch(removeUser(id));
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <input
        type="text"
        placeholder="Search by username/email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <UserForm onSubmit={handleCreate} />

      {loading ? (
        <p>Loading...</p>
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
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
