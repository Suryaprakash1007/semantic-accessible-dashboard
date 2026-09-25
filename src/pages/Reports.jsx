function Reports() {
  return (
    <main id="main-content" className="reports-main">
      <section aria-labelledby="reports-title">
        <h1 id="reports-title">Reports</h1>
        <p>View workspace activity and report summaries.</p>
      </section>

      <section aria-labelledby="activity-title">
        <h2 id="activity-title">Recent Activity</h2>

        <article>
          <h3>User Registration Report</h3>
          <p>
            This report summarizes user registrations
            and account activity.
          </p>
          <p>
            <strong>Last updated:</strong> 25 September 2026
          </p>
        </article>

        <article>
          <h3>System Usage Report</h3>
          <p>
            This report provides an overview of
            workspace usage.
          </p>
          <p>
            <strong>Status:</strong> Available
          </p>
        </article>
      </section>
    </main>
  );
}

export default Reports;