import { useEffect, useState } from 'react';
import AdminLogin from './components/AdminLogin.jsx';
import LeadForm from './components/LeadForm.jsx';
import QuotePreview from './pages/QuotePreview.jsx';
import { clearAdminToken, verifyAdminSession } from './api';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    verifyAdminSession()
      .then((ok) => setAuthenticated(ok))
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    setAuthenticated(false);
    setQuote(null);
  };

  if (checking) {
    return (
      <div style={styles.loading}>
        Verifying admin session…
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <div>
          <p style={styles.brand}>Serene Vibes Kashmir</p>
          <h1 style={styles.title}>Itinerary Builder</h1>
          <p style={styles.tagline}>A Poem In Motion — Admin Dashboard</p>
        </div>
        <div style={styles.headerActions}>
          <a href="/" style={styles.link}>View Website</a>
          <button type="button" onClick={handleLogout} style={styles.logout}>
            Sign Out
          </button>
        </div>
      </header>

      <section style={styles.builderSection}>
        <div style={styles.sectionIntro}>
          <h2 style={styles.sectionTitle}>Create Client Itinerary</h2>
          <p style={styles.sectionText}>
            Enter trip details below to generate a day-wise plan, assign hotels, calculate costs, and export a PDF quotation.
          </p>
        </div>
        <LeadForm onGenerated={setQuote} />
      </section>

      {quote && <QuotePreview quote={quote} />}
    </div>
  );
}

const styles = {
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, system-ui, sans-serif',
    color: '#5a6578',
  },
  shell: {
    minHeight: '100vh',
    background: '#f7f8fa',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '24px 32px',
    background: '#1e3a4f',
    color: '#fff',
    borderBottom: '1px solid #152a3a',
    flexWrap: 'wrap',
  },
  brand: {
    margin: 0,
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#b8956b',
    fontWeight: 700,
  },
  title: {
    margin: '4px 0',
    fontSize: '1.75rem',
    fontFamily: 'Georgia, serif',
    fontWeight: 600,
  },
  tagline: {
    margin: 0,
    fontSize: '0.875rem',
    opacity: 0.8,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.875rem',
    opacity: 0.9,
  },
  logout: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  builderSection: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionIntro: {
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: '0 0 8px',
    fontSize: '1.35rem',
    color: '#1e3a4f',
    fontFamily: 'Georgia, serif',
  },
  sectionText: {
    margin: 0,
    color: '#5a6578',
    maxWidth: '720px',
    lineHeight: 1.6,
  },
};
