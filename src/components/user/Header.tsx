import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../../../public/Header.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { reset, updateProfile } from "../../features/auth/authSlice";
import { logout } from "../../features/auth/authSlice";
import { useState } from "react";
import api from "../../services/api";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user,isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  async function handleFileinput(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("file input kk ethundo");
    
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.put(`/user/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // const newFilepath = res.data.profilePic;
      dispatch(updateProfile(res.data));
      alert("profile pircture updated");
      console.log(res.data);
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Upload failed");
    }
  }

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">User Management</Link>
      </div>
      <ul>
        {isAuthenticated && user ? (
          <div className="user-menu">
            <div
              className="user-icon"
              onClick={toggleDropdown}
              style={{ display: "flex", alignItems: "center" }}
            >
              {user.profilePic?  (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    marginRight: "8px",
                    objectFit: "cover",
                  }}
                />
              ):
              (
                <FaUser style={{ marginRight: '8px' }} />
              )}
              <span style={{ marginLeft: '8px' }}>{user.username}</span>

            </div>

            {showDropdown && (
              <div className="dropdown">
                <Link to="/profile" style={{ display: 'block', padding: '8px' }}>
                  Profile
                </Link>
                <button
                  onClick={() => document.getElementById("fileInput")?.click()}
                  style={{ display: 'block', width: '100%', padding: '8px', textAlign: 'left' }}
                >
                  Change Profile Picture
                </button>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileinput}
                />
                <button onClick={onLogout} style={{ display: 'block', width: '100%', padding: '8px', textAlign: 'left' }}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Header;
