function Sidebar() {
  return (
    <aside className="app-sidebar" aria-label="Dashboard sidebar">
      <nav aria-label="Sidebar navigation">
        <h2>Workspace</h2>

        <ul>
          <li>
            <a href="/" aria-current="page">
              Overview
            </a>
          </li>

          <li>
            <a href="/users">User Management</a>
          </li>

          <li>
            <a href="/reports">Reports</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;