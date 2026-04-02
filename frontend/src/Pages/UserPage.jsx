import { useState, useEffect } from "react";

const colors = {
  deepTeal: '#002324',
  sand: '#E5DDDE',
  sage: '#A1AD95',
  mint: '#EBFACF',
  white: '#FFFFFF',
};

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f3f0',
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    color: colors.deepTeal,
  },
  main: {
    padding: '0',
    minHeight: '100vh',
  },
  topbar: {
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.sand}`,
    padding: '1.25rem 2.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  pageTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: colors.deepTeal,
    letterSpacing: '-0.02em',
  },
  pageDate: {
    fontSize: '0.8rem',
    color: colors.sage,
    letterSpacing: '0.05em',
    marginTop: '2px',
  },
  content: {
    padding: '2rem 2.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  statCard: (accent) => ({
    backgroundColor: colors.white,
    borderRadius: '12px',
    padding: '1.5rem',
    border: `1px solid ${colors.sand}`,
    borderTop: `4px solid ${accent}`,
    boxShadow: '0 2px 8px rgba(0,35,36,0.05)',
  }),
  statLabel: {
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: colors.sage,
    marginBottom: '0.5rem',
    fontFamily: '"DM Sans", sans-serif',
  },
  statValue: (color) => ({
    fontSize: '2.4rem',
    fontWeight: '700',
    color: color || colors.deepTeal,
    lineHeight: 1,
    letterSpacing: '-0.02em',
  }),
  statSub: {
    fontSize: '0.75rem',
    color: colors.sage,
    marginTop: '0.25rem',
    fontFamily: '"DM Sans", sans-serif',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: '12px',
    border: `1px solid ${colors.sand}`,
    boxShadow: '0 2px 8px rgba(0,35,36,0.05)',
    marginBottom: '2rem',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    borderBottom: `1px solid ${colors.sand}`,
    backgroundColor: '#faf9f7',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: colors.deepTeal,
    letterSpacing: '-0.01em',
  },
  primaryBtn: {
    padding: '0.6rem 1.4rem',
    backgroundColor: colors.deepTeal,
    color: colors.mint,
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '0.03em',
    transition: 'all 0.2s',
    fontFamily: '"DM Sans", sans-serif',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
    fontFamily: '"DM Sans", sans-serif',
  },
  th: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: '0.68rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: colors.sage,
    backgroundColor: '#faf9f7',
    borderBottom: `1px solid ${colors.sand}`,
    fontWeight: '600',
  },
  td: {
    padding: '1rem',
    borderBottom: `1px solid #f0eeec`,
    color: colors.deepTeal,
    verticalAlign: 'middle',
  },
  badge: (role) => {
    const map = {
      client: { bg: colors.mint, color: colors.deepTeal, border: colors.sage },
      therapist: { bg: '#EEF2FF', color: '#3730A3', border: '#C7D2FE' },
      admin: { bg: '#FFF8E1', color: '#B7791F', border: '#F6E05E' },
    };
    const s = map[role] || map.client;
    return {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '0.72rem',
      fontWeight: '600',
      letterSpacing: '0.05em',
      backgroundColor: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      textTransform: 'capitalize',
    };
  },
  actionBtn: (variant) => ({
    padding: '5px 10px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.15s',
    fontFamily: '"DM Sans", sans-serif',
    ...(variant === 'edit'
      ? { backgroundColor: colors.sand, color: colors.deepTeal }
      : variant === 'deactivate'
      ? { backgroundColor: '#FFF5F5', color: '#C53030', border: '1px solid #FEB2B2' }
      : { backgroundColor: colors.mint, color: colors.deepTeal }),
  }),
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: colors.sage,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: colors.deepTeal,
    flexShrink: 0,
    marginRight: '10px',
  },
  // Modal overlay
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,35,36,0.55)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(2px)',
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: '16px',
    width: '460px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 24px 60px rgba(0,35,36,0.25)',
    border: `1px solid ${colors.sand}`,
  },
  modalHeader: {
    padding: '1.5rem 2rem',
    borderBottom: `1px solid ${colors.sand}`,
    backgroundColor: colors.deepTeal,
    borderRadius: '16px 16px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: colors.mint,
    letterSpacing: '-0.01em',
  },
  modalClose: {
    background: 'none',
    border: 'none',
    color: colors.sage,
    fontSize: '1.2rem',
    cursor: 'pointer',
    lineHeight: 1,
    padding: '2px 6px',
    borderRadius: '4px',
  },
  modalBody: {
    padding: '1.5rem 2rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.72rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: colors.sage,
    marginBottom: '0.4rem',
    fontFamily: '"DM Sans", sans-serif',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.9rem',
    borderRadius: '8px',
    border: `1px solid ${colors.sand}`,
    backgroundColor: '#faf9f7',
    fontSize: '0.85rem',
    color: colors.deepTeal,
    fontFamily: '"DM Sans", sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  select: {
    width: '100%',
    padding: '0.6rem 0.9rem',
    borderRadius: '8px',
    border: `1px solid ${colors.sand}`,
    backgroundColor: '#faf9f7',
    fontSize: '0.85rem',
    color: colors.deepTeal,
    fontFamily: '"DM Sans", sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  modalFooter: {
    padding: '1rem 2rem 1.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
  },
  cancelBtn: {
    padding: '0.6rem 1.4rem',
    backgroundColor: 'transparent',
    color: colors.sage,
    border: `1px solid ${colors.sand}`,
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '0.03em',
    fontFamily: '"DM Sans", sans-serif',
  },
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'client' });
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/login");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const addUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      setUsers([...users, data]);
      setShowModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'client' });
    } catch (err) {
      console.error(err);
      alert('Failed to add user');
    }
  };

const deactivateUser = async (id) => {
  try {
    const res = await fetch("http://localhost:5000/api/therapists", {
      method: 'PATCH', // PATCH is better for updates
      headers: { 'Content-Type': 'application/json' },
    });
    const updatedUser = await res.json();

    // Update the state
    setUsers(users.map((u) => (u.id === id ? updatedUser : u)));
  } catch (err) {
    console.error(err);
    alert('Failed to deactivate user');
  }
};


  const roles = ['all', 'client', 'therapist', 'admin'];
  const filtered = filterRole === 'all' ? users : users.filter((u) => u.role === filterRole);

  const totalUsers = users.length;
  const clientCount = users.filter((u) => u.role === 'client').length;
  const therapistCount = users.filter((u) => u.role === 'therapist').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

return (
  <>
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
    <div style={styles.app}>
      <main style={styles.main}>
        <div style={styles.content}>

          {/* Stats */}
          <div style={styles.statsGrid}>
            <div
              style={styles.statCard(colors.deepTeal)}
              onClick={() => setFilterRole('all')}
              className="clickable-card"
            >
              <div style={styles.statLabel}>Total Users</div>
              <div style={styles.statValue(colors.deepTeal)}>{totalUsers}</div>
              <div style={styles.statSub}>All registered accounts</div>
            </div>
            <div
              style={styles.statCard(colors.sage)}
              onClick={() => setFilterRole('client')}
              className="clickable-card"
            >
              <div style={styles.statLabel}>Clients</div>
              <div style={styles.statValue(colors.deepTeal)}>{clientCount}</div>
              <div style={styles.statSub}>Active patient accounts</div>
            </div>
            <div
              style={styles.statCard('#3730A3')}
              onClick={() => setFilterRole('therapist')}
              className="clickable-card"
            >
              <div style={styles.statLabel}>Therapists</div>
              <div style={styles.statValue('#3730A3')}>{therapistCount}</div>
              <div style={styles.statSub}>Registered practitioners</div>
            </div>
            <div
              style={styles.statCard('#B7791F')}
              onClick={() => setFilterRole('admin')}
              className="clickable-card"
            >
              <div style={styles.statLabel}>Admins</div>
              <div style={styles.statValue('#B7791F')}>{adminCount}</div>
              <div style={styles.statSub}>System administrators</div>
            </div>
          </div>

          {/* Users Table */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <div style={styles.cardTitle}>User Management</div>
              <button style={styles.primaryBtn} onClick={() => setShowModal(true)}>
                + Add User
              </button>
            </div>

            {/* Role Filter Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '4px',
                padding: '1.25rem 2rem 0',
                borderBottom: `1px solid ${colors.sand}`,
                backgroundColor: colors.white,
              }}
            >
              {roles.map((role) => {
                const active = filterRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    style={{
                      padding: '0.55rem 1.5rem',
                      fontSize: '0.85rem',
                      fontWeight: active ? '600' : '400',
                      color: active ? colors.deepTeal : colors.sage,
                      backgroundColor: active ? colors.mint : 'transparent',
                      border: 'none',
                      borderRadius: '8px 8px 0 0',
                      cursor: 'pointer',
                      letterSpacing: '0.03em',
                      transition: 'all 0.2s',
                      fontFamily: '"DM Sans", sans-serif',
                      borderBottom: active ? `3px solid ${colors.deepTeal}` : '3px solid transparent',
                      boxShadow: active ? 'inset 0 -2px 0 0 rgba(0,35,36,0.2)' : 'none',
                    }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                );
              })}
            </div>

            <div style={{ overflowX: 'auto', padding: '0 0 0.5rem' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['User', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map((h) => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          ...styles.td,
                          textAlign: 'center',
                          color: colors.sage,
                          padding: '2.5rem',
                          fontStyle: 'italic',
                        }}
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      <tr
                        key={u.id}
                        style={{ transition: 'background 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#faf9f7')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={styles.avatar}>{getInitials(u.name)}</div>
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{u.name}</div>
                              <div style={{ fontSize: '0.72rem', color: colors.sage }}>ID: {u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>
                          <span style={styles.badge(u.role)}>{u.role}</span>
                        </td>
                        <td style={styles.td}>{formatDate(u.createdAt)}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#276749',
                              marginRight: '6px',
                              verticalAlign: 'middle',
                            }}
                          />
                          <span style={{ fontSize: '0.78rem', color: '#276749', fontWeight: '600' }}>Active</span>
                        </td>
                        <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button style={styles.actionBtn('edit')}>✎ Edit</button>
                            <button
                              style={styles.actionBtn('deactivate')}
                              onClick={() => deactivateUser(u.id)}
                            >
                              ✕ Deactivate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    {/* Add User Modal */}
    {showModal && (
      <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
        <div style={styles.modal}>
          <div style={styles.modalHeader}>
            <div style={styles.modalTitle}>Add New User</div>
            <button style={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
          </div>

          <div style={styles.modalBody}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                placeholder="e.g. Jane Doe"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                placeholder="e.g. jane@example.com"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                placeholder="Set a secure password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
              <select
                style={styles.select}
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="client">Client</option>
                <option value="therapist">Therapist</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
            <button style={styles.primaryBtn} onClick={addUser}>Add User</button>
          </div>
        </div>
      </div>
    )}
  </>
);

}