
import { useEffect, useMemo, useState } from "react";
import Modal from "../components/common/Modal";
import { fetchUsers } from "../api/api";

const CACHE_KEY = "rabtech-users-cache";
const ADDED_USERS_KEY = "rabtech-added-users";

function readStorage(key, fallback = []) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function Users() {
  const [users, setUsers] = useState(() =>
    readStorage(CACHE_KEY, [])
  );

  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch users from the REST API
  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError("");

      try {
        const apiUsers = await fetchUsers();

        const formattedUsers = apiUsers.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: "Employee",
          status: "Active",
        }));

        // Preserve users added through the form
        const addedUsers = readStorage(
          ADDED_USERS_KEY,
          []
        );

        const combinedUsers = [
          ...formattedUsers,
          ...addedUsers,
        ];

        if (!cancelled) {
          setUsers(combinedUsers);

          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify(combinedUsers)
            );
          } catch {
            setError(
              "Users loaded, but browser storage is unavailable."
            );
          }
        }
      } catch {
        if (!cancelled) {
          setError(
            users.length > 0
              ? "Unable to refresh users. Showing cached data."
              : "Unable to load users. Please check your connection and try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  // Search, filter, and sort users
  const filteredUsers = useMemo(() => {
    let result = users.filter((user) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole =
        activeRole === "All" ||
        user.role === activeRole;

      return matchesSearch && matchesRole;
    });

    result.sort((a, b) => {
      return a[sortBy].localeCompare(b[sortBy]);
    });

    return result;
  }, [users, search, activeRole, sortBy]);

  // Add a new user and save it in localStorage
  function handleAddUser(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const newUser = {
      id: Date.now(),
      name: formData.get("modalUserName").trim(),
      email: formData.get("modalUserEmail").trim(),
      role: "Employee",
      status: "Active",
    };

    const addedUsers = readStorage(
      ADDED_USERS_KEY,
      []
    );

    const updatedAddedUsers = [
      ...addedUsers,
      newUser,
    ];

    try {
      localStorage.setItem(
        ADDED_USERS_KEY,
        JSON.stringify(updatedAddedUsers)
      );

      const updatedUsers = [...users, newUser];

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(updatedUsers)
      );

      setUsers(updatedUsers);
      setMessage(`${newUser.name} was added successfully.`);
      event.currentTarget.reset();
    } catch {
      setError(
        "Unable to save the user. Browser storage may be full or unavailable."
      );
    }
  }

  const roles = [
    "All",
    "Administrator",
    "Manager",
    "Employee",
  ];

  return (
    <main id="main-content" className="users-main">
      <section aria-labelledby="users-title">
        <h1 id="users-title">User Management</h1>
        <p>
          Manage user information and add new users.
        </p>
      </section>

      {/* Add user */}
      <section aria-labelledby="add-user-title">
        <h2 id="add-user-title">Add New User</h2>

        <Modal
          title="Add New User"
          triggerLabel="Open Add User Form"
        >
          <form onSubmit={handleAddUser}>
            <fieldset>
              <legend>User Information</legend>

              <div>
                <label htmlFor="modal-user-name">
                  Full Name
                </label>
                <input
                  id="modal-user-name"
                  name="modalUserName"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label htmlFor="modal-user-email">
                  Email Address
                </label>
                <input
                  id="modal-user-email"
                  name="modalUserEmail"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </fieldset>

            <button type="submit">
              Save User
            </button>
          </form>
        </Modal>

        <p role="status" aria-live="polite">
          {message}
        </p>
      </section>

      {/* Search, filter, and sort */}
      <section aria-labelledby="user-controls-title">
        <h2 id="user-controls-title">
          Search and Filter Users
        </h2>

        <div className="user-controls">
          <div>
            <label htmlFor="user-search">
              Search by name or email
            </label>
            <input
              id="user-search"
              type="search"
              placeholder="Search users..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div>
            <label htmlFor="user-sort">
              Sort users
            </label>
            <select
              id="user-sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
            >
              <option value="name">
                Name (A–Z)
              </option>
              <option value="email">
                Email (A–Z)
              </option>
            </select>
          </div>
        </div>

        <div
          className="user-filter-tabs"
          role="group"
          aria-label="Filter users by role"
        >
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              className={
                activeRole === role
                  ? "filter-tab active"
                  : "filter-tab"
              }
              aria-pressed={activeRole === role}
              onClick={() => setActiveRole(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </section>

      {/* API results */}
      <section aria-labelledby="user-table-title">
        <h2 id="user-table-title">
          Existing Users
        </h2>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div
            className="loading-skeleton"
            role="status"
            aria-label="Loading users"
          >
            <p>Loading users...</p>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                className="skeleton-row"
                key={index}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <>
            <p aria-live="polite">
              Showing {filteredUsers.length} of{" "}
              {users.length} users
            </p>

            <div className="table-wrapper">
              <table>
                <caption>
                  List of registered users
                </caption>

                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <th scope="row">
                        {user.name}
                      </th>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.status}</td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4">
                        No users found. Try a different
                        search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Users;