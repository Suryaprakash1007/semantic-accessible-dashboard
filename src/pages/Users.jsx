
import { useEffect, useMemo, useState } from "react";
import Modal from "../components/common/Modal";
import { fetchUsers } from "../api/api";

const CACHE_KEY = "rabtech-users-cache";
const ADDED_USERS_KEY = "rabtech-added-users";
const DELETED_USERS_KEY = "rabtech-deleted-users";
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

  const [editingUser, setEditingUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // Fetch API users
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

        const addedUsers = readStorage(
  ADDED_USERS_KEY,
  []
);

const cachedUsers = readStorage(CACHE_KEY, []);

const deletedUserIds = readStorage(
  DELETED_USERS_KEY,
  []
);

const deletedIds = new Set(deletedUserIds);

        // Keep edits to API users from localStorage
        const mergedApiUsers = formattedUsers
  .filter((apiUser) => !deletedIds.has(apiUser.id))
  .map((apiUser) => {
    const cached = cachedUsers.find(
      (user) => user.id === apiUser.id
    );

    return cached
      ? { ...apiUser, ...cached }
      : apiUser;
  });

        const combinedUsers = [
          ...mergedApiUsers,
          ...addedUsers,
        ];

        if (!cancelled) {
          setUsers(combinedUsers);

          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(combinedUsers)
          );
        }
      } catch {
        if (!cancelled) {
          setError(
            users.length
              ? "Unable to refresh users. Showing cached data."
              : "Unable to load users. Check your internet connection."
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

  // Save users and persist changes
  function persistUsers(updatedUsers) {
    setUsers(updatedUsers);

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(updatedUsers)
      );

      const apiIds = new Set(
        Array.from({ length: 10 }, (_, i) => i + 1)
      );

      const addedUsers = updatedUsers.filter(
        (user) => !apiIds.has(user.id)
      );

      localStorage.setItem(
        ADDED_USERS_KEY,
        JSON.stringify(addedUsers)
      );
    } catch {
      setError("Unable to save changes to browser storage.");
    }
  }

  // Search, filter, and sort
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const query = search.toLowerCase().trim();

        const matchesSearch =
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query);

        const matchesRole =
          activeRole === "All" ||
          user.role === activeRole;

        return matchesSearch && matchesRole;
      })
      .sort((a, b) =>
        a[sortBy].localeCompare(b[sortBy])
      );
  }, [users, search, activeRole, sortBy]);

  // Create
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

    persistUsers([...users, newUser]);

    setMessage(`${newUser.name} was added successfully.`);
    event.currentTarget.reset();
  }

  // Open edit modal
  function openEdit(user) {
    setEditingUser({ ...user });
    setEditOpen(true);
  }

  // Update
  function handleEditUser(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const updatedUser = {
      ...editingUser,
      name: formData.get("editUserName").trim(),
      email: formData.get("editUserEmail").trim(),
      role: formData.get("editUserRole"),
      status: formData.get("editUserStatus"),
    };

    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );

    persistUsers(updatedUsers);

    setMessage(`${updatedUser.name} was updated successfully.`);
    setEditOpen(false);
    setEditingUser(null);
  }

  // Delete
  
function handleDeleteUser(user) {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${user.name}?`
  );

  if (!confirmed) return;

  const updatedUsers = users.filter(
    (item) => item.id !== user.id
  );

  // Persist the updated user list
  persistUsers(updatedUsers);

  // Track deleted API users so they don't return
  const apiIds = new Set(
    Array.from({ length: 10 }, (_, i) => i + 1)
  );

  if (apiIds.has(user.id)) {
    const deletedIds = readStorage(
      DELETED_USERS_KEY,
      []
    );

    if (!deletedIds.includes(user.id)) {
      try {
        localStorage.setItem(
          DELETED_USERS_KEY,
          JSON.stringify([...deletedIds, user.id])
        );
      } catch {
        setError(
          "Unable to save deleted user information."
        );
      }
    }
  }

  setMessage(`${user.name} was deleted successfully.`);
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
                  required
                  minLength={3}
                  autoComplete="name"
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
                  required
                  autoComplete="email"
                />
              </div>
            </fieldset>

            <button type="submit">Save User</button>
          </form>
        </Modal>

        <p role="status" aria-live="polite">
          {message}
        </p>
      </section>

      {/* Edit user modal */}
      <Modal
        title="Edit User"
        open={editOpen}
        onClose={() => setEditOpen(false)}
      >
        {editingUser && (
          <form onSubmit={handleEditUser}>
            <fieldset>
              <legend>Edit User Information</legend>

              <div>
                <label htmlFor="edit-user-name">
                  Full Name
                </label>
                <input
                  id="edit-user-name"
                  name="editUserName"
                  defaultValue={editingUser.name}
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label htmlFor="edit-user-email">
                  Email Address
                </label>
                <input
                  id="edit-user-email"
                  name="editUserEmail"
                  type="email"
                  defaultValue={editingUser.email}
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-user-role">
                  Role
                </label>
                <select
                  id="edit-user-role"
                  name="editUserRole"
                  defaultValue={editingUser.role}
                >
                  <option value="Administrator">
                    Administrator
                  </option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-user-status">
                  Status
                </label>
                <select
                  id="edit-user-status"
                  name="editUserStatus"
                  defaultValue={editingUser.status}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </fieldset>

            <button type="submit">Save Changes</button>
          </form>
        )}
      </Modal>

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
            <label htmlFor="user-sort">Sort users</label>
            <select
              id="user-sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
            >
              <option value="name">Name (A–Z)</option>
              <option value="email">Email (A–Z)</option>
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

      {/* User table */}
      <section aria-labelledby="user-table-title">
        <h2 id="user-table-title">Existing Users</h2>

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
              Showing {filteredUsers.length} of {users.length} users
            </p>

            <div
  className="table-wrapper"
  role="region"
  aria-label="Users table. Scroll horizontally to view all columns."
  tabIndex={0}
>
              <table>
                <caption>List of registered users</caption>

                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <th scope="row">{user.name}</th>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.status}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => openEdit(user)}
                          aria-label={`Edit ${user.name}`}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          aria-label={`Delete ${user.name}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="5">
                        No users found.
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