// const UserTable = ({ users, onEdit, onDelete }: any) => {
//     return (
//       <table className="user-table">
//         <thead>
//           <tr>
//             <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user: any) => (
//             <tr key={user.id}>
//               <td>{user.id}</td>
//               <td>{user.username}</td>
//               <td>{user.email}</td>
//               <td>{user.role}</td>
//               <td>
//                 <button onClick={() => onEdit(user)}>Edit</button>
//                 <button onClick={() => onDelete(user.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };
  
//   export default UserTable;
  
// UserTable Component
const UserTable = ({ users, onEdit, onDelete }:any ) => {
  if (!users || users.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3 className="empty-state-message">No users found</h3>
        <p>Try adjusting your search or add a new user</p>
      </div>
    );
  }

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user:any) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role || 'User'}</td>
            <td>
              <div className="action-buttons">
                <button className="edit-btn" onClick={() => onEdit(user)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => onDelete(user.id)}>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default UserTable;