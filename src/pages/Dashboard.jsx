function Dashboard() {
  return (
    <main id="main-content" className="dashboard-main">
      <section aria-labelledby="dashboard-title">
        <h1 id="dashboard-title">Dashboard Overview</h1>

        <p>
          Welcome to AccessBoard. Manage users, review
          reports, and monitor your workspace.
        </p>
      </section>

      <section aria-labelledby="summary-title">
        <h2 id="summary-title">Summary</h2>

        <div className="summary-cards">
          <article>
            <h3>Total Users</h3>
            <p>120</p>
          </article>

          <article>
            <h3>Active Users</h3>
            <p>98</p>
          </article>

          <article>
            <h3>Pending Requests</h3>
            <p>12</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;