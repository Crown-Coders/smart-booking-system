import { useState, useEffect} from 'react';

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



const stats = { total: 10, pending: 3, confirmed: 5, cancelled: 2, totalSlots: 8, availableSlots: 3 };
const bookings = [
  { id: '1', patientName: 'John Doe', patientEmail: 'john@example.com', therapist: 'Dr. Smith', date: '2026-03-03', time: '10:00', status: 'pending', paymentStatus: 'paid', amount: 200, notes: '' },
  { id: '2', patientName: 'Jane Roe', patientEmail: 'jane@example.com', therapist: 'Dr. Brown', date: '2026-03-04', time: '12:00', status: 'confirmed', paymentStatus: 'unpaid', amount: 150, notes: 'Follow-up' },
  { id: '3', patientName: 'Mark Lane', patientEmail: 'mark@example.com', therapist: 'Dr. Smith', date: '2026-03-05', time: '09:00', status: 'cancelled', paymentStatus: 'unpaid', amount: 200, notes: '' },
];


const formatDate = (d) => new Date(d).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });

export default function AdminDashboard() {
  const [filter, setFilter] = useState('all');
  // Modal open/close state
const [showModal, setShowModal] = useState(false);
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  const objectUrl = URL.createObjectURL(file);
  img.src = objectUrl;

  img.onload = () => {
    const maxWidth = 150; // small width for production
    const scale = maxWidth / img.width;
    const canvas = document.createElement("canvas");
    canvas.width = maxWidth;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // compress to JPEG at 0.6 quality
    const dataUrl = canvas.toDataURL("image/jpeg", 0.6);

    setNewTherapist(prev => ({
      ...prev,
      image: dataUrl
    }));

    URL.revokeObjectURL(objectUrl);
  };
};



// New therapist form state
const [newTherapist, setNewTherapist] = useState({
  name: '',
  surname: '',
  title: 'Dr.',
  specialty: '',
  typeOfPractice: '',
  yearsOfExperience: '',
  licenseNumber: '',
  bio: '',
  image: '',
  email: '',
  password: '',
});

// Dynamic therapists list
const [therapistsList, setTherapistsList] = useState([]);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);


useEffect(() => {
  const fetchTherapists = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/therapists');
      if (!res.ok) throw new Error('Failed to fetch therapists');
      const data = await res.json();

      // map backend fields to match your frontend display if needed
      const formatted = data.map(t => ({
        id: t.id,
        name: t.user?.name?.split(' ')[0] || '',  // if you stored full name in User
        surname: t.user?.name?.split(' ')[1] || '',
        title: 'Dr.',
        specialty: t.specialization,
        typeOfPractice: t.typeOfPractice,
        yearsOfExperience: t.yearsOfExperience,
        hpcsaNumber: t.licenseNumber,
        image: t.image || `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)}` // placeholder if empty
      }));

      setTherapistsList(formatted);
    } catch (err) {
      console.error(err);
      alert('Failed to load therapists from server');
    }
  };

  fetchTherapists();
}, []);



return (
  <>
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
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
              <div style={styles.statValue(colors.deepTeal)}>
                {stats.availableSlots}
                <span style={{ fontSize: '1rem', color: colors.sage }}>
                  /{stats.totalSlots}
                </span>
              </div>
              <div style={styles.statSub}>Open appointments</div>
            </div>
          </div>

          {/* Bookings Table */}
          <div style={styles.card}>
            <div style={styles.tabsRow}>
              {['all', 'pending', 'confirmed', 'cancelled'].map((tab) => (
                <button
                  key={tab}
                  style={styles.tab(filter === tab)}
                  onClick={() => setFilter(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ overflowX: 'auto', padding: '0 0 0.5rem' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {[
                      'Patient',
                      'Therapist',
                      'Date',
                      'Time',
                      'Status',
                      'Payment',
                      'Amount',
                      'Notes',
                      'Actions',
                    ].map((h) => (
                      <th key={h} style={styles.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr
                      key={b.id}
                      style={{ transition: 'background 0.15s' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#faf9f7')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                          {b.patientName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: colors.sage }}>
                          {b.patientEmail}
                        </div>
                      </td>
                      <td style={styles.td}>{b.therapist}</td>
                      <td style={styles.td}>{formatDate(b.date)}</td>
                      <td style={styles.td}>{b.time}</td>
                      <td style={styles.td}>
                        <span style={styles.badge(b.status)}>{b.status}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.badge(b.paymentStatus)}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td style={styles.td}>R{b.amount}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            color: colors.sage,
                            fontStyle: b.notes ? 'normal' : 'italic',
                          }}
                        >
                          {b.notes || 'None'}
                        </span>
                      </td>
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
              <button
                style={styles.primaryBtn}
                onClick={() => setShowModal(true)}
              >
                + Add Therapist
              </button>
            </div>

            <div style={styles.therapistsGrid}>
              {therapistsList.map((t) => (
                <div key={t.id} style={styles.therapistCard}>
                  <div style={styles.therapistCardTop}>
                    <img src={t.image} alt={t.name} style={styles.therapistImg} />
                    <div>
                      <div style={styles.therapistName}>
                        {t.title} {t.name} {t.surname}
                      </div>
                      <div style={styles.therapistSpec}>{t.specialty}</div>
                    </div>
                  </div>
                  <div style={styles.therapistBody}>
                    <div style={styles.therapistMeta}>
                      <span style={{ display: 'inline-block', marginRight: '8px' }}>
                        🏥 {t.typeOfPractice}
                      </span>
                      <br />
                      <span style={{ display: 'inline-block', marginRight: '8px' }}>
                        ⏱ {t.yearsOfExperience} yrs experience
                      </span>
                      <br />
                      <span>🪪 HPCSA: {t.hpcsaNumber}</span>
                    </div>
                    <div style={styles.therapistActions}>
                      <button
                        style={{ ...styles.actionBtn('edit'), flex: 1, justifyContent: 'center' }}
                      >
                        ✎ Edit
                      </button>
                      <button
                        style={{ ...styles.actionBtn('reject'), flex: 1, justifyContent: 'center' }}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>

    {/* Add Therapist Modal */}
    {showModal && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            width: '400px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <h2>Add Therapist</h2>
          <input
            placeholder="First Name"
            value={newTherapist.name}
            onChange={(e) =>
              setNewTherapist({ ...newTherapist, name: e.target.value })
            }
            style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          />
          <input
            placeholder="Surname"
            value={newTherapist.surname}
            onChange={(e) =>
              setNewTherapist({ ...newTherapist, surname: e.target.value })
            }
            style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          />
          <input
            placeholder="Email"
            value={newTherapist.email}
            onChange={(e) =>
              setNewTherapist({ ...newTherapist, email: e.target.value })
            }
            style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          />
          <input
            placeholder="Password"
            type="password"
            value={newTherapist.password}
            onChange={(e) =>
              setNewTherapist({ ...newTherapist, password: e.target.value })
            }
            style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          />
          <input
            placeholder="Specialty"
            value={newTherapist.specialty}
            onChange={(e) =>
              setNewTherapist({ ...newTherapist, specialty: e.target.value })
            }
            style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          />
          <input
            placeholder="Years of Experience"
            type="number"
            value={newTherapist.yearsOfExperience}
            onChange={(e) =>
              setNewTherapist({ ...newTherapist, yearsOfExperience: e.target.value })
            }
            style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          />
          <input
            placeholder="License Number"
            value={newTherapist.licenseNumber}
            onChange={(e) =>
              setNewTherapist({ ...newTherapist, licenseNumber: e.target.value })
            }
            style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          />
          <input
            placeholder="Type of Practice"
            value={newTherapist.typeOfPractice}
            onChange={(e) =>
              setNewTherapist({ ...newTherapist, typeOfPractice: e.target.value })
            }
            style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          />
          <textarea
            placeholder="Bio"
            value={newTherapist.bio}
            onChange={(e) =>
              setNewTherapist({ ...newTherapist, bio: e.target.value })
            }
            style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button style={{ padding: '0.5rem 1rem' }} onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button
              style={{ padding: '0.5rem 1rem', backgroundColor: '#002324', color: '#EBFACF' }}
              onClick={async () => {
                try {
                  const res = await fetch('http://localhost:5000/api/therapists', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTherapist),
                  });
                  if (!res.ok) throw new Error('Failed to add therapist');
                  const data = await res.json();
                  const formatted = {
                    id: data.therapist.id,
                    name: data.therapist.user?.name?.split(' ')[0] || '',
                    surname: data.therapist.user?.name?.split(' ')[1] || '',
                    title: 'Dr.',
                    specialty: data.therapist.specialization,
                    typeOfPractice: data.therapist.typeOfPractice,
                    yearsOfExperience: data.therapist.yearsOfExperience,
                    hpcsaNumber: data.therapist.licenseNumber,
                    image: data.therapist.image || `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)}`
                  };
                  setTherapistsList([...therapistsList, formatted]);

                  setShowModal(false);
                  setNewTherapist({
                    name: '',
                    surname: '',
                    email: '',
                    password: '',
                    specialty: '',
                    yearsOfExperience: '',
                    licenseNumber: '',
                    typeOfPractice: '',
                    bio: '',
                    image: '',
                  });
                } catch (err) {
                  console.error(err);
                  alert('Failed to add therapist');
                }
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}
