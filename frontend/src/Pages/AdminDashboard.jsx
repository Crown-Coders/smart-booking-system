import { useState } from 'react';

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
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '240px',
    height: '100vh',
    backgroundColor: colors.deepTeal,
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    zIndex: 100,
    boxShadow: '4px 0 24px rgba(0,35,36,0.15)',
  },
  sidebarLogo: {
    padding: '2rem 1.5rem 1.5rem',
    borderBottom: `1px solid rgba(161,173,149,0.2)`,
  },
  logoText: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: colors.mint,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  logoSub: {
    fontSize: '0.7rem',
    color: colors.sage,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginTop: '4px',
  },
  sidebarNav: {
    flex: 1,
    padding: '1.5rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    borderRadius: '0',
    fontSize: '0.9rem',
    fontWeight: active ? '600' : '400',
    color: active ? colors.mint : colors.sage,
    backgroundColor: active ? 'rgba(235,250,207,0.1)' : 'transparent',
    borderLeft: active ? `3px solid ${colors.mint}` : '3px solid transparent',
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  }),
  sidebarFooter: {
    padding: '1.5rem',
    borderTop: `1px solid rgba(161,173,149,0.2)`,
  },
  userBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: colors.sage,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: colors.deepTeal,
    flexShrink: 0,
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: colors.mint,
  },
  userRole: {
    fontSize: '0.7rem',
    color: colors.sage,
    letterSpacing: '0.08em',
  },
  logoutBtn: {
    marginTop: '0.75rem',
    width: '100%',
    padding: '0.6rem',
    backgroundColor: 'rgba(235,250,207,0.08)',
    color: colors.sage,
    border: `1px solid rgba(161,173,149,0.3)`,
    borderRadius: '8px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'all 0.2s',
  },
main: {
  marginLeft: '240px',   // keep sidebar offset
  padding: '0',
  minHeight: '100vh',
  marginTop: '60px',     // push content below navbar
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
  searchBar: {
    padding: '0.6rem 1.2rem',
    borderRadius: '20px',
    border: `1px solid ${colors.sand}`,
    backgroundColor: '#f9f8f6',
    fontSize: '0.85rem',
    outline: 'none',
    width: '220px',
    color: colors.deepTeal,
    fontFamily: 'inherit',
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
    position: 'relative',
    overflow: 'hidden',
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
  cardHeader: {
    padding: '1.5rem 2rem',
    borderBottom: `1px solid ${colors.sand}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#faf9f7',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: colors.deepTeal,
    letterSpacing: '-0.01em',
  },
  tabsRow: {
    display: 'flex',
    gap: '4px',
    padding: '1.25rem 2rem 0',
    borderBottom: `1px solid ${colors.sand}`,
    backgroundColor: colors.white,
  },
  tab: (active) => ({
    padding: '0.5rem 1.25rem',
    fontSize: '0.82rem',
    fontWeight: active ? '600' : '400',
    color: active ? colors.deepTeal : colors.sage,
    backgroundColor: active ? colors.mint : 'transparent',
    border: 'none',
    borderRadius: '6px 6px 0 0',
    cursor: 'pointer',
    letterSpacing: '0.03em',
    transition: 'all 0.15s',
    fontFamily: '"DM Sans", sans-serif',
    borderBottom: active ? `2px solid ${colors.deepTeal}` : '2px solid transparent',
  }),
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
  badge: (type) => {
    const map = {
      pending: { bg: '#FFF8E1', color: '#B7791F', border: '#F6E05E' },
      confirmed: { bg: '#F0FFF4', color: '#276749', border: '#9AE6B4' },
      cancelled: { bg: '#FFF5F5', color: '#C53030', border: '#FEB2B2' },
      paid: { bg: colors.mint, color: colors.deepTeal, border: colors.sage },
      unpaid: { bg: '#FFF5F5', color: '#C53030', border: '#FEB2B2' },
    };
    const s = map[type] || map.pending;
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
    ...(variant === 'approve'
      ? { backgroundColor: colors.mint, color: colors.deepTeal }
      : variant === 'reject'
      ? { backgroundColor: '#FFF5F5', color: '#C53030', border: '1px solid #FEB2B2' }
      : { backgroundColor: colors.sand, color: colors.deepTeal }),
  }),
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
  therapistsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.25rem',
    padding: '1.5rem 2rem',
  },
  therapistCard: {
    borderRadius: '10px',
    border: `1px solid ${colors.sand}`,
    overflow: 'hidden',
    backgroundColor: colors.white,
    transition: 'box-shadow 0.2s',
  },
  therapistCardTop: {
    backgroundColor: colors.deepTeal,
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  therapistImg: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    border: `2px solid ${colors.mint}`,
    objectFit: 'cover',
  },
  therapistName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: colors.mint,
  },
  therapistSpec: {
    fontSize: '0.75rem',
    color: colors.sage,
    marginTop: '2px',
  },
  therapistBody: {
    padding: '1rem 1.25rem',
  },
  therapistMeta: {
    fontSize: '0.78rem',
    color: colors.sage,
    fontFamily: '"DM Sans", sans-serif',
    marginBottom: '0.75rem',
    lineHeight: 1.6,
  },
  therapistActions: {
    display: 'flex',
    gap: '8px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0',
    padding: '1.5rem 2rem',
    borderBottom: `1px solid ${colors.sand}`,
    backgroundColor: '#faf9f7',
  },
};

const navItems = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'bookings', label: 'Bookings', icon: '◷' },
  { id: 'therapists', label: 'Therapists', icon: '◉' },
  { id: 'patients', label: 'Patients', icon: '◌' },
  { id: 'reports', label: 'Reports', icon: '◫' },
  { id: 'settings', label: 'Settings', icon: '◎' },
];

const user = { name: 'Admin User', initials: 'AU' };
const stats = { total: 10, pending: 3, confirmed: 5, cancelled: 2, totalSlots: 8, availableSlots: 3 };
const bookings = [
  { id: '1', patientName: 'John Doe', patientEmail: 'john@example.com', therapist: 'Dr. Smith', date: '2026-03-03', time: '10:00', status: 'pending', paymentStatus: 'paid', amount: 200, notes: '' },
  { id: '2', patientName: 'Jane Roe', patientEmail: 'jane@example.com', therapist: 'Dr. Brown', date: '2026-03-04', time: '12:00', status: 'confirmed', paymentStatus: 'unpaid', amount: 150, notes: 'Follow-up' },
  { id: '3', patientName: 'Mark Lane', patientEmail: 'mark@example.com', therapist: 'Dr. Smith', date: '2026-03-05', time: '09:00', status: 'cancelled', paymentStatus: 'unpaid', amount: 200, notes: '' },
];
const therapists = [
  { id: 't1', name: 'Alice', surname: 'Smith', title: 'Dr.', specialty: 'Physiotherapy', typeOfPractice: 'Private', yearsOfExperience: 5, hpcsaNumber: '12345', image: 'https://i.pravatar.cc/150?img=47' },
  { id: 't2', name: 'Bob', surname: 'Brown', title: 'Dr.', specialty: 'Occupational Therapy', typeOfPractice: 'Clinic', yearsOfExperience: 7, hpcsaNumber: '67890', image: 'https://i.pravatar.cc/150?img=12' },
  { id: 't3', name: 'Claire', surname: 'Nkosi', title: 'Dr.', specialty: 'Speech Therapy', typeOfPractice: 'Private', yearsOfExperience: 4, hpcsaNumber: '11223', image: 'https://i.pravatar.cc/150?img=23' },
];

const formatDate = (d) => new Date(d).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });

export default function AdminDashboard() {
  const [activeNav] = useState('overview');
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={styles.app}>

        {/* Sidebar */}
       

        {/* Main */}
        <main style={styles.main}>


          <div style={styles.content}>

            {/* Stats */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard(colors.deepTeal)}>
                <div style={styles.statLabel}>Total Bookings</div>
                <div style={styles.statValue(colors.deepTeal)}>{stats.total}</div>
                <div style={styles.statSub}>All time records</div>
              </div>
              <div style={styles.statCard('#B7791F')}>
                <div style={styles.statLabel}>Pending</div>
                <div style={styles.statValue('#B7791F')}>{stats.pending}</div>
                <div style={styles.statSub}>Awaiting confirmation</div>
              </div>
              <div style={styles.statCard('#276749')}>
                <div style={styles.statLabel}>Confirmed</div>
                <div style={styles.statValue('#276749')}>{stats.confirmed}</div>
                <div style={styles.statSub}>Ready to proceed</div>
              </div>
              <div style={styles.statCard(colors.sage)}>
                <div style={styles.statLabel}>Available Slots</div>
                <div style={styles.statValue(colors.deepTeal)}>{stats.availableSlots}<span style={{ fontSize: '1rem', color: colors.sage }}>/{stats.totalSlots}</span></div>
                <div style={styles.statSub}>Open appointments</div>
              </div>
            </div>

            {/* Bookings Table */}
            <div style={styles.card}>
              

              <div style={styles.tabsRow}>
                {['all', 'pending', 'confirmed', 'cancelled'].map(tab => (
                  <button key={tab} style={styles.tab(filter === tab)} onClick={() => setFilter(tab)}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div style={{ overflowX: 'auto', padding: '0 0 0.5rem' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {['Patient', 'Therapist', 'Date', 'Time', 'Status', 'Payment', 'Amount', 'Notes', 'Actions'].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(b => (
                      <tr key={b.id} style={{ transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf9f7'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={styles.td}>
                          <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{b.patientName}</div>
                          <div style={{ fontSize: '0.72rem', color: colors.sage }}>{b.patientEmail}</div>
                        </td>
                        <td style={styles.td}>{b.therapist}</td>
                        <td style={styles.td}>{formatDate(b.date)}</td>
                        <td style={styles.td}>{b.time}</td>
                        <td style={styles.td}><span style={styles.badge(b.status)}>{b.status}</span></td>
                        <td style={styles.td}><span style={styles.badge(b.paymentStatus)}>{b.paymentStatus}</span></td>
                        <td style={styles.td}>R{b.amount}</td>
                        <td style={styles.td}><span style={{ color: colors.sage, fontStyle: b.notes ? 'normal' : 'italic' }}>{b.notes || 'None'}</span></td>
                        <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button style={styles.actionBtn('approve')}>✓</button>
                            <button style={styles.actionBtn('reject')}>✕</button>
                            <button style={styles.actionBtn('edit')}>✎</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Therapists */}
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <div style={styles.cardTitle}>Therapist Roster</div>
                <button style={styles.primaryBtn}>+ Add Therapist</button>
              </div>
              <div style={styles.therapistsGrid}>
                {therapists.map(t => (
                  <div key={t.id} style={styles.therapistCard}>
                    <div style={styles.therapistCardTop}>
                      <img src={t.image} alt={t.name} style={styles.therapistImg} />
                      <div>
                        <div style={styles.therapistName}>{t.title} {t.name} {t.surname}</div>
                        <div style={styles.therapistSpec}>{t.specialty}</div>
                      </div>
                    </div>
                    <div style={styles.therapistBody}>
                      <div style={styles.therapistMeta}>
                        <span style={{ display: 'inline-block', marginRight: '8px' }}>🏥 {t.typeOfPractice}</span><br/>
                        <span style={{ display: 'inline-block', marginRight: '8px' }}>⏱ {t.yearsOfExperience} yrs experience</span><br/>
                        <span>🪪 HPCSA: {t.hpcsaNumber}</span>
                      </div>
                      <div style={styles.therapistActions}>
                        <button style={{ ...styles.actionBtn('edit'), flex: 1, justifyContent: 'center' }}>✎ Edit</button>
                        <button style={{ ...styles.actionBtn('reject'), flex: 1, justifyContent: 'center' }}>🗑 Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>

      </div>
    </>
  );
}