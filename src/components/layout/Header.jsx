function Header() {
  return (
    <header className="app-header">
      <a href="/" className="brand">
        AccessBoard
      </a>

      <nav aria-label="Main navigation">
        <ul>
          <li>
            <a href="/" aria-current="page">
              Dashboard
            </a>
          </li>

          <li>
            <a href="/users">Users</a>
          </li>

          <li>
            <a href="/reports">Reports</a>
          </li>
        </ul>
      </nav>

      <div className="header-profile">
        <span>Welcome, Admin</span>
      </div>
    </header>
  );
}

export default Header;