import { useState } from "react";
import Modal from "../components/common/Modal";
function Users() {
    const [users, setUsers] = useState([
  {
    id: 1,
    name: "Arun Kumar",
    email: "arun@example.com",
    role: "Administrator",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Devi",
    email: "priya@example.com",
    role: "Manager",
    status: "Active",
  },
]);

const [message, setMessage] = useState("");

function handleAddUser(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const newUser = {
    id: Date.now(),
    name: formData.get("modalUserName"),
    email: formData.get("modalUserEmail"),
    role: "Employee",
    status: "Active",
  };

  setUsers((previousUsers) => [...previousUsers, newUser]);

  setMessage(`${newUser.name} was added successfully.`);
  event.currentTarget.reset();
}
    
  return (
    <main id="main-content" className="users-main">
      <section aria-labelledby="users-title">
        <h1 id="users-title">User Management</h1>
        <p>Manage user information and add new users.</p>
    </section>
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

      <button type="submit">Save User</button>
    </form>
  </Modal>

  <p role="status" aria-live="polite">
    {message}
  </p>
</section>

<section aria-labelledby="user-table-title">
  <h2 id="user-table-title">Existing Users</h2>

  <table>
    <caption>List of registered users</caption>

    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Role</th>
        <th scope="col">Status</th>
      </tr>
    </thead>

    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          <th scope="row">{user.name}</th>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>{user.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</section>

    </main>
  );
}

export default Users;