import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="app-header">
      <NavLink to="/" className="brand">
  AccessBoard
</NavLink>
      <nav aria-label="Main navigation">
  <ul>
    <li>
      <NavLink to="/" end>
        Dashboard
      </NavLink>
    </li>

    <li>
      <NavLink to="/users">
        Users
      </NavLink>
    </li>

    <li>
      <NavLink to="/reports">
        Reports
      </NavLink>
    </li>
  </ul>
</nav>
      

      <div className="header-profile">
        <span>
          Welcome, {user?.name || "User"}
        </span>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;