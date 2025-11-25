import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Currency formatter
const fmt = (n) => n < 0 ? `(${Math.abs(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })})` : n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const pct = (n) => `${(n * 100).toFixed(1)}%`;

// Color palette - industrial/studio aesthetic
const colors = {
  bg: '#0a0a0a',
  surface: '#141414',
  surfaceLight: '#1a1a1a',
  border: '#2a2a2a',
  text: '#e0e0e0',
  textMuted: '#888',
  accent: '#f5c518', // Gold/amber - studio vibe
  accentDim: '#a68a12',
  positive: '#22c55e',
  negative: '#ef4444',
  membership: '#f5c518',
  hourly: '#3b82f6',
  events: '#a855f7',
  ancillary: '#22c55e',
};

// Password for access - change this to your desired password
const ACCESS_PASSWORD = '3rdspace2025';

// Login Screen Component
const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ACCESS_PASSWORD) {
      sessionStorage.setItem('3rdspace_authenticated', 'true');
      onLogin();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <div style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          color: colors.text,
          marginBottom: '8px',
          letterSpacing: '-0.5px',
        }}>
          3RD SPACE
        </div>
        <div style={{
          fontSize: '12px',
          color: colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '32px',
        }}>
          Financial Model
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '14px 16px',
              background: colors.bg,
              border: `1px solid ${error ? colors.negative : colors.border}`,
              borderRadius: '4px',
              color: colors.text,
              fontSize: '14px',
              outline: 'none',
              marginBottom: '12px',
              boxSizing: 'border-box',
            }}
            autoFocus
          />
          {error && (
            <div style={{
              fontSize: '12px',
              color: colors.negative,
              marginBottom: '12px',
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: colors.accent,
              border: 'none',
              borderRadius: '4px',
              color: colors.bg,
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

// Info Tooltip Component
const InfoTooltip = ({ text, position = 'above' }) => {
  const [show, setShow] = useState(false);
  const isBelow = position === 'below';
  return (
    <span style={{ position: 'relative', display: 'inline-flex', marginLeft: '6px' }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          border: `1px solid ${colors.textMuted}`,
          color: colors.textMuted,
          fontSize: '10px',
          fontWeight: '600',
          cursor: 'help',
          transition: 'all 0.2s',
          ...(show && { borderColor: colors.accent, color: colors.accent }),
        }}
      >
        ?
      </span>
      {show && (
        <div style={{
          position: 'absolute',
          ...(isBelow ? { top: '100%', marginTop: '8px' } : { bottom: '100%', marginBottom: '8px' }),
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 12px',
          background: colors.surfaceLight,
          border: `1px solid ${colors.border}`,
          borderRadius: '4px',
          fontSize: '11px',
          color: colors.text,
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          maxWidth: '250px',
          whiteSpace: 'normal',
          lineHeight: '1.4',
        }}>
          {text}
          <div style={{
            position: 'absolute',
            ...(isBelow ? { bottom: '100%', borderBottom: `6px solid ${colors.border}`, borderTop: 'none' } : { top: '100%', borderTop: `6px solid ${colors.border}`, borderBottom: 'none' }),
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
          }} />
        </div>
      )}
    </span>
  );
};

const InputField = ({ label, value, onChange, type = 'number', prefix = '', suffix = '', min = 0, step = 1, tooltip }) => (
  <div style={{ marginBottom: '12px' }}>
    <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: colors.textMuted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
      {tooltip && <InfoTooltip text={tooltip} />}
    </label>
    <div style={{ display: 'flex', alignItems: 'center', background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '4px', padding: '0 8px' }}>
      {prefix && <span style={{ color: colors.textMuted, fontSize: '13px', marginRight: '4px' }}>{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        step={step}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          color: colors.accent,
          fontSize: '14px',
          fontFamily: "'JetBrains Mono', monospace",
          padding: '8px 0',
          outline: 'none',
          width: '100%',
        }}
      />
      {suffix && <span style={{ color: colors.textMuted, fontSize: '13px', marginLeft: '4px' }}>{suffix}</span>}
    </div>
  </div>
);

const MetricCard = ({ label, value, subvalue, trend, color = colors.accent, tooltip, tooltipPosition = 'above' }) => (
  <div style={{
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '16px',
    position: 'relative',
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: color, borderRadius: '8px 0 0 8px' }} />
    <div style={{ fontSize: '11px', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
      {label}
      {tooltip && <InfoTooltip text={tooltip} position={tooltipPosition} />}
    </div>
    <div style={{ fontSize: '24px', fontFamily: "'JetBrains Mono', monospace", color: colors.text, fontWeight: '600' }}>{value}</div>
    {subvalue && <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>{subvalue}</div>}
    {trend !== undefined && (
      <div style={{ fontSize: '12px', color: trend >= 0 ? colors.positive : colors.negative, marginTop: '4px' }}>
        {trend >= 0 ? '↑' : '↓'} {pct(Math.abs(trend))}
      </div>
    )}
  </div>
);

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: '24px', background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '16px 20px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: open ? `1px solid ${colors.border}` : 'none',
          background: colors.surfaceLight,
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: colors.text }}>{title}</span>
        <span style={{ color: colors.textMuted, fontSize: '18px' }}>{open ? '−' : '+'}</span>
      </div>
      {open && <div style={{ padding: '20px' }}>{children}</div>}
    </div>
  );
};

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: '12px 24px',
      background: active ? colors.accent : 'transparent',
      color: active ? colors.bg : colors.textMuted,
      border: `1px solid ${active ? colors.accent : colors.border}`,
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
  >
    {children}
  </button>
);

// API base URL - always use relative path (Vite proxy handles dev, same server in prod)
const API_URL = '/api';

// Save/Load Modal Component
const SaveLoadModal = ({ isOpen, onClose, mode, onSave, onLoad, currentData }) => {
  const [models, setModels] = useState([]);
  const [saveName, setSaveName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchModels();
      setSaveName('');
      setError('');
    }
  }, [isOpen]);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/models`);
      if (res.ok) {
        const data = await res.json();
        setModels(data);
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!saveName.trim()) {
      setError('Please enter a name');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: saveName, data: currentData })
      });
      if (res.ok) {
        onClose();
      } else {
        setError('Failed to save');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/models/${id}`);
      if (res.ok) {
        const model = await res.json();
        onLoad(model.data);
        onClose();
      }
    } catch (err) {
      setError('Failed to load model');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this saved model?')) return;
    try {
      await fetch(`${API_URL}/models/${id}`, { method: 'DELETE' });
      fetchModels();
    } catch (err) {
      setError('Failed to delete');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
    }} onClick={onClose}>
      <div style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        width: '500px',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '20px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: colors.text }}>
            {mode === 'save' ? 'Save Model' : 'Load Model'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: colors.textMuted,
            fontSize: '20px',
            cursor: 'pointer',
          }}>×</button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{
              padding: '10px',
              background: colors.negative + '20',
              border: `1px solid ${colors.negative}`,
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '12px',
              color: colors.negative,
            }}>{error}</div>
          )}

          {mode === 'save' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>
                Model Name
              </label>
              <input
                type="text"
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                placeholder="e.g., Base Case Q1 2025"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  color: colors.text,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '12px',
                  background: colors.accent,
                  border: 'none',
                  borderRadius: '4px',
                  color: colors.bg,
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Saving...' : 'Save Model'}
              </button>
            </div>
          )}

          {models.length > 0 && (
            <>
              <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '10px', textTransform: 'uppercase' }}>
                {mode === 'save' ? 'Or overwrite existing:' : 'Saved Models'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {models.map(model => (
                  <div
                    key={model.id}
                    onClick={() => mode === 'load' ? handleLoad(model.id) : null}
                    style={{
                      padding: '12px 16px',
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '4px',
                      cursor: mode === 'load' ? 'pointer' : 'default',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'border-color 0.2s',
                      ...(mode === 'load' && { ':hover': { borderColor: colors.accent } }),
                    }}
                    onMouseOver={e => mode === 'load' && (e.currentTarget.style.borderColor = colors.accent)}
                    onMouseOut={e => e.currentTarget.style.borderColor = colors.border}
                  >
                    <div>
                      <div style={{ fontSize: '14px', color: colors.text, fontWeight: '500' }}>{model.name}</div>
                      <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '4px' }}>
                        {formatDate(model.updated_at)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(model.id, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.textMuted,
                        fontSize: '16px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                      }}
                      title="Delete"
                    >×</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {loading && models.length === 0 && (
            <div style={{ textAlign: 'center', color: colors.textMuted, padding: '20px' }}>
              Loading...
            </div>
          )}

          {!loading && models.length === 0 && mode === 'load' && (
            <div style={{ textAlign: 'center', color: colors.textMuted, padding: '20px' }}>
              No saved models yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ThirdSpaceDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('3rdspace_authenticated') === 'true';
  });

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return <Dashboard />;
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [saveLoadModal, setSaveLoadModal] = useState({ open: false, mode: 'save' });
  
  // ===== MEMBERSHIP ASSUMPTIONS =====
  const [studentFee, setStudentFee] = useState(65);
  const [studentMembers, setStudentMembers] = useState(25);
  const [studentGrowth, setStudentGrowth] = useState(0.20);
  
  const [artistFee, setArtistFee] = useState(175);
  const [artistMembers, setArtistMembers] = useState(12);
  const [artistGrowth, setArtistGrowth] = useState(0.25);
  
  const [proFee, setProFee] = useState(350);
  const [proMembers, setProMembers] = useState(4);
  const [proGrowth, setProGrowth] = useState(0.15);
  
  // ===== HOURLY SERVICES =====
  const [rehearsalRate, setRehearsalRate] = useState(35);
  const [rehearsalHours, setRehearsalHours] = useState(40);
  const [rehearsalGrowth, setRehearsalGrowth] = useState(0.15);
  
  const [recordingRate, setRecordingRate] = useState(100);
  const [recordingHours, setRecordingHours] = useState(20);
  const [recordingGrowth, setRecordingGrowth] = useState(0.25);
  
  const [lessonRate, setLessonRate] = useState(80);
  const [lessonHours, setLessonHours] = useState(30);
  const [lessonGrowth, setLessonGrowth] = useState(0.20);
  const [lessonCommission, setLessonCommission] = useState(0.35);
  
  // ===== EVENTS & STREAMING =====
  const [streamingRate, setStreamingRate] = useState(200);
  const [streamingEvents, setStreamingEvents] = useState(3);
  const [streamingGrowth, setStreamingGrowth] = useState(0.30);
  
  const [showcaseRate, setShowcaseRate] = useState(400);
  const [showcaseEvents, setShowcaseEvents] = useState(2);
  const [showcaseGrowth, setShowcaseGrowth] = useState(0.25);
  
  const [corporateRate, setCorporateRate] = useState(500);
  const [corporateEvents, setCorporateEvents] = useState(1);
  const [corporateGrowth, setCorporateGrowth] = useState(0.20);
  
  // ===== ANCILLARY =====
  const [merchAvg, setMerchAvg] = useState(35);
  const [merchSales, setMerchSales] = useState(30);
  const [merchGrowth, setMerchGrowth] = useState(0.30);
  
  const [rentalAvg, setRentalAvg] = useState(30);
  const [rentalSales, setRentalSales] = useState(20);
  const [rentalGrowth, setRentalGrowth] = useState(0.20);
  
  const [bevAvg, setBevAvg] = useState(5);
  const [bevSales, setBevSales] = useState(100);
  const [bevGrowth, setBevGrowth] = useState(0.25);
  
  // ===== STARTUP COSTS =====
  const [buildout, setBuildout] = useState(30000);
  const [equipment, setEquipment] = useState(15000);
  const [streaming, setStreaming] = useState(3000);
  const [opCapital, setOpCapital] = useState(25000);
  const [legal, setLegal] = useState(8000);
  const [marketing, setMarketing] = useState(5000);
  const [contingencyPct, setContingencyPct] = useState(0.15);
  
  // ===== MONTHLY OPERATING =====
  const [rent, setRent] = useState(2500);
  const [utilities, setUtilities] = useState(500);
  const [insurance, setInsurance] = useState(400);
  const [monthlyMarketing, setMonthlyMarketing] = useState(500);
  const [software, setSoftware] = useState(250);
  const [maintenance, setMaintenance] = useState(400);
  const [misc, setMisc] = useState(300);
  
  // ===== STAFFING =====
  const [techDirectorRate, setTechDirectorRate] = useState(0);
  const [techDirectorHours, setTechDirectorHours] = useState(0);
  const [generalManagerRate, setGeneralManagerRate] = useState(0);
  const [generalManagerHours, setGeneralManagerHours] = useState(0);
  const [studentWorkerRate, setStudentWorkerRate] = useState(20);
  const [studentWorkerHours, setStudentWorkerHours] = useState(80);
  const [eventStaffRate, setEventStaffRate] = useState(22);
  const [eventStaffHours, setEventStaffHours] = useState(16);
  
  // ===== OWNER DRAW =====
  const [ownerDrawY2, setOwnerDrawY2] = useState(40000);
  const [ownerDrawY3, setOwnerDrawY3] = useState(80000);
  
  // ===== CAPACITY =====
  const [dailyHours, setDailyHours] = useState(12);
  const [daysPerWeek, setDaysPerWeek] = useState(7);
  const [liveRoomLockout, setLiveRoomLockout] = useState(40);
  const [utilizationTarget, setUtilizationTarget] = useState(0.55);
  
  // ===== TAM =====
  const [primaryMarket, setPrimaryMarket] = useState(1664);
  const [secondaryMarket, setSecondaryMarket] = useState(2809);
  const [weekenders, setWeekenders] = useState(225);
  const [conversionRate, setConversionRate] = useState(0.012);

  // ===== SAVE/LOAD FUNCTIONS =====
  const getCurrentData = () => ({
    studentFee, studentMembers, studentGrowth,
    artistFee, artistMembers, artistGrowth,
    proFee, proMembers, proGrowth,
    rehearsalRate, rehearsalHours, rehearsalGrowth,
    recordingRate, recordingHours, recordingGrowth,
    lessonRate, lessonHours, lessonGrowth, lessonCommission,
    streamingRate, streamingEvents, streamingGrowth,
    showcaseRate, showcaseEvents, showcaseGrowth,
    corporateRate, corporateEvents, corporateGrowth,
    merchAvg, merchSales, merchGrowth,
    rentalAvg, rentalSales, rentalGrowth,
    bevAvg, bevSales, bevGrowth,
    buildout, equipment, streaming, opCapital, legal, marketing, contingencyPct,
    rent, utilities, insurance, monthlyMarketing, software, maintenance, misc,
    techDirectorRate, techDirectorHours, generalManagerRate, generalManagerHours,
    studentWorkerRate, studentWorkerHours, eventStaffRate, eventStaffHours,
    ownerDrawY2, ownerDrawY3,
    dailyHours, daysPerWeek, liveRoomLockout, utilizationTarget,
    primaryMarket, secondaryMarket, weekenders, conversionRate,
  });

  const loadData = (data) => {
    if (data.studentFee !== undefined) setStudentFee(data.studentFee);
    if (data.studentMembers !== undefined) setStudentMembers(data.studentMembers);
    if (data.studentGrowth !== undefined) setStudentGrowth(data.studentGrowth);
    if (data.artistFee !== undefined) setArtistFee(data.artistFee);
    if (data.artistMembers !== undefined) setArtistMembers(data.artistMembers);
    if (data.artistGrowth !== undefined) setArtistGrowth(data.artistGrowth);
    if (data.proFee !== undefined) setProFee(data.proFee);
    if (data.proMembers !== undefined) setProMembers(data.proMembers);
    if (data.proGrowth !== undefined) setProGrowth(data.proGrowth);
    if (data.rehearsalRate !== undefined) setRehearsalRate(data.rehearsalRate);
    if (data.rehearsalHours !== undefined) setRehearsalHours(data.rehearsalHours);
    if (data.rehearsalGrowth !== undefined) setRehearsalGrowth(data.rehearsalGrowth);
    if (data.recordingRate !== undefined) setRecordingRate(data.recordingRate);
    if (data.recordingHours !== undefined) setRecordingHours(data.recordingHours);
    if (data.recordingGrowth !== undefined) setRecordingGrowth(data.recordingGrowth);
    if (data.lessonRate !== undefined) setLessonRate(data.lessonRate);
    if (data.lessonHours !== undefined) setLessonHours(data.lessonHours);
    if (data.lessonGrowth !== undefined) setLessonGrowth(data.lessonGrowth);
    if (data.lessonCommission !== undefined) setLessonCommission(data.lessonCommission);
    if (data.streamingRate !== undefined) setStreamingRate(data.streamingRate);
    if (data.streamingEvents !== undefined) setStreamingEvents(data.streamingEvents);
    if (data.streamingGrowth !== undefined) setStreamingGrowth(data.streamingGrowth);
    if (data.showcaseRate !== undefined) setShowcaseRate(data.showcaseRate);
    if (data.showcaseEvents !== undefined) setShowcaseEvents(data.showcaseEvents);
    if (data.showcaseGrowth !== undefined) setShowcaseGrowth(data.showcaseGrowth);
    if (data.corporateRate !== undefined) setCorporateRate(data.corporateRate);
    if (data.corporateEvents !== undefined) setCorporateEvents(data.corporateEvents);
    if (data.corporateGrowth !== undefined) setCorporateGrowth(data.corporateGrowth);
    if (data.merchAvg !== undefined) setMerchAvg(data.merchAvg);
    if (data.merchSales !== undefined) setMerchSales(data.merchSales);
    if (data.merchGrowth !== undefined) setMerchGrowth(data.merchGrowth);
    if (data.rentalAvg !== undefined) setRentalAvg(data.rentalAvg);
    if (data.rentalSales !== undefined) setRentalSales(data.rentalSales);
    if (data.rentalGrowth !== undefined) setRentalGrowth(data.rentalGrowth);
    if (data.bevAvg !== undefined) setBevAvg(data.bevAvg);
    if (data.bevSales !== undefined) setBevSales(data.bevSales);
    if (data.bevGrowth !== undefined) setBevGrowth(data.bevGrowth);
    if (data.buildout !== undefined) setBuildout(data.buildout);
    if (data.equipment !== undefined) setEquipment(data.equipment);
    if (data.streaming !== undefined) setStreaming(data.streaming);
    if (data.opCapital !== undefined) setOpCapital(data.opCapital);
    if (data.legal !== undefined) setLegal(data.legal);
    if (data.marketing !== undefined) setMarketing(data.marketing);
    if (data.contingencyPct !== undefined) setContingencyPct(data.contingencyPct);
    if (data.rent !== undefined) setRent(data.rent);
    if (data.utilities !== undefined) setUtilities(data.utilities);
    if (data.insurance !== undefined) setInsurance(data.insurance);
    if (data.monthlyMarketing !== undefined) setMonthlyMarketing(data.monthlyMarketing);
    if (data.software !== undefined) setSoftware(data.software);
    if (data.maintenance !== undefined) setMaintenance(data.maintenance);
    if (data.misc !== undefined) setMisc(data.misc);
    if (data.techDirectorRate !== undefined) setTechDirectorRate(data.techDirectorRate);
    if (data.techDirectorHours !== undefined) setTechDirectorHours(data.techDirectorHours);
    if (data.generalManagerRate !== undefined) setGeneralManagerRate(data.generalManagerRate);
    if (data.generalManagerHours !== undefined) setGeneralManagerHours(data.generalManagerHours);
    if (data.studentWorkerRate !== undefined) setStudentWorkerRate(data.studentWorkerRate);
    if (data.studentWorkerHours !== undefined) setStudentWorkerHours(data.studentWorkerHours);
    if (data.eventStaffRate !== undefined) setEventStaffRate(data.eventStaffRate);
    if (data.eventStaffHours !== undefined) setEventStaffHours(data.eventStaffHours);
    if (data.ownerDrawY2 !== undefined) setOwnerDrawY2(data.ownerDrawY2);
    if (data.ownerDrawY3 !== undefined) setOwnerDrawY3(data.ownerDrawY3);
    if (data.dailyHours !== undefined) setDailyHours(data.dailyHours);
    if (data.daysPerWeek !== undefined) setDaysPerWeek(data.daysPerWeek);
    if (data.liveRoomLockout !== undefined) setLiveRoomLockout(data.liveRoomLockout);
    if (data.utilizationTarget !== undefined) setUtilizationTarget(data.utilizationTarget);
    if (data.primaryMarket !== undefined) setPrimaryMarket(data.primaryMarket);
    if (data.secondaryMarket !== undefined) setSecondaryMarket(data.secondaryMarket);
    if (data.weekenders !== undefined) setWeekenders(data.weekenders);
    if (data.conversionRate !== undefined) setConversionRate(data.conversionRate);
  };

  // ===== CALCULATIONS =====
  const calculations = useMemo(() => {
    // Startup
    const startupSubtotal = buildout + equipment + streaming + opCapital + legal + marketing;
    const contingency = startupSubtotal * contingencyPct;
    const totalStartup = startupSubtotal + contingency;
    
    // Monthly fixed costs
    const monthlyFixed = rent + utilities + insurance + monthlyMarketing + software + maintenance + misc;
    const monthlyStaffing = (techDirectorRate * techDirectorHours) + (generalManagerRate * generalManagerHours) + (studentWorkerRate * studentWorkerHours) + (eventStaffRate * eventStaffHours);
    
    // Year 1 Revenue (with ramp-up - avg 75% of full year)
    const membershipY1 = ((studentFee * studentMembers) + (artistFee * artistMembers) + (proFee * proMembers)) * 12 * 0.83;
    const hourlyY1 = ((rehearsalRate * rehearsalHours) + (recordingRate * recordingHours) + (lessonRate * lessonHours * lessonCommission)) * 12 * 0.85;
    const eventsY1 = ((streamingRate * streamingEvents) + (showcaseRate * showcaseEvents) + (corporateRate * corporateEvents)) * 12 * 0.85;
    const ancillaryY1 = ((merchAvg * merchSales) + (rentalAvg * rentalSales) + (bevAvg * bevSales)) * 12 * 0.80;
    const totalRevenueY1 = membershipY1 + hourlyY1 + eventsY1 + ancillaryY1;
    
    // Year 1 Expenses
    const totalExpensesY1 = (monthlyFixed * 12) + (monthlyStaffing * 12);
    const netIncomeY1 = totalRevenueY1 - totalExpensesY1;
    const cumulativeY1 = netIncomeY1 - totalStartup;
    
    // Year 2 (with growth)
    const membershipY2 = ((studentFee * studentMembers * (1 + studentGrowth)) + (artistFee * artistMembers * (1 + artistGrowth)) + (proFee * proMembers * (1 + proGrowth))) * 12;
    const hourlyY2 = ((rehearsalRate * rehearsalHours * (1 + rehearsalGrowth)) + (recordingRate * recordingHours * (1 + recordingGrowth)) + (lessonRate * lessonHours * lessonCommission * (1 + lessonGrowth))) * 12;
    const eventsY2 = ((streamingRate * streamingEvents * (1 + streamingGrowth)) + (showcaseRate * showcaseEvents * (1 + showcaseGrowth)) + (corporateRate * corporateEvents * (1 + corporateGrowth))) * 12;
    const ancillaryY2 = ((merchAvg * merchSales * (1 + merchGrowth)) + (rentalAvg * rentalSales * (1 + rentalGrowth)) + (bevAvg * bevSales * (1 + bevGrowth))) * 12;
    const totalRevenueY2 = membershipY2 + hourlyY2 + eventsY2 + ancillaryY2;
    const totalExpensesY2 = (monthlyFixed * 12 * 1.03) + (monthlyStaffing * 12 * 1.10) + ownerDrawY2;
    const netIncomeY2 = totalRevenueY2 - totalExpensesY2;
    const cumulativeY2 = cumulativeY1 + netIncomeY2;
    
    // Year 3 (compounded growth)
    const membershipY3 = ((studentFee * studentMembers * Math.pow(1 + studentGrowth, 2)) + (artistFee * artistMembers * Math.pow(1 + artistGrowth, 2)) + (proFee * proMembers * Math.pow(1 + proGrowth, 2))) * 12;
    const hourlyY3 = ((rehearsalRate * rehearsalHours * Math.pow(1 + rehearsalGrowth, 2)) + (recordingRate * recordingHours * Math.pow(1 + recordingGrowth, 2)) + (lessonRate * lessonHours * lessonCommission * Math.pow(1 + lessonGrowth, 2))) * 12;
    const eventsY3 = ((streamingRate * streamingEvents * Math.pow(1 + streamingGrowth, 2)) + (showcaseRate * showcaseEvents * Math.pow(1 + showcaseGrowth, 2)) + (corporateRate * corporateEvents * Math.pow(1 + corporateGrowth, 2))) * 12;
    const ancillaryY3 = ((merchAvg * merchSales * Math.pow(1 + merchGrowth, 2)) + (rentalAvg * rentalSales * Math.pow(1 + rentalGrowth, 2)) + (bevAvg * bevSales * Math.pow(1 + bevGrowth, 2))) * 12;
    const totalRevenueY3 = membershipY3 + hourlyY3 + eventsY3 + ancillaryY3;
    const totalExpensesY3 = (monthlyFixed * 12 * 1.06) + (monthlyStaffing * 12 * 1.18) + ownerDrawY3;
    const netIncomeY3 = totalRevenueY3 - totalExpensesY3;
    const cumulativeY3 = cumulativeY2 + netIncomeY3;
    
    // Capacity
    const weeklyHours = dailyHours * daysPerWeek;
    const monthlyHours = weeklyHours * 4.33;
    const liveRoomNet = monthlyHours - liveRoomLockout - ((monthlyHours - liveRoomLockout) * 0.15);
    const controlRoomNet = monthlyHours - 6 - ((monthlyHours - 6) * 0.15);
    const totalCapacity = liveRoomNet + controlRoomNet;
    
    // Hours required for Y1 revenue
    const memberHoursRequired = (studentMembers * 4) + (artistMembers * 6) + (proMembers * 8);
    const serviceHoursRequired = rehearsalHours + (recordingHours * 3) + lessonHours;
    const eventHoursRequired = (streamingEvents * 4) + (showcaseEvents * 5) + (corporateEvents * 6);
    const totalHoursRequired = memberHoursRequired + serviceHoursRequired + eventHoursRequired;
    const utilizationRequired = totalHoursRequired / totalCapacity;
    
    // TAM
    const totalTAM = primaryMarket + secondaryMarket + weekenders;
    const projectedMembers = totalTAM * conversionRate;
    const tamRevenueEstimate = projectedMembers * ((studentFee + artistFee + proFee) / 3) * 12;
    
    // Operating margins
    const marginY1 = netIncomeY1 / totalRevenueY1;
    const marginY2 = netIncomeY2 / totalRevenueY2;
    const marginY3 = netIncomeY3 / totalRevenueY3;
    
    // Monthly breakdown for chart
    const monthlyData = [];
    const rampFactors = [0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0];
    let cumulative = -totalStartup;
    
    for (let i = 0; i < 12; i++) {
      const factor = rampFactors[i];
      const membership = ((studentFee * studentMembers) + (artistFee * artistMembers) + (proFee * proMembers)) * factor;
      const hourly = ((rehearsalRate * rehearsalHours) + (recordingRate * recordingHours) + (lessonRate * lessonHours * lessonCommission)) * factor;
      const events = ((streamingRate * streamingEvents) + (showcaseRate * showcaseEvents) + (corporateRate * corporateEvents)) * factor;
      const ancillary = ((merchAvg * merchSales) + (rentalAvg * rentalSales) + (bevAvg * bevSales)) * factor;
      const revenue = membership + hourly + events + ancillary;
      const expenses = monthlyFixed + monthlyStaffing;
      const net = revenue - expenses;
      cumulative += net;
      
      monthlyData.push({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        revenue,
        expenses,
        net,
        cumulative,
        membership,
        hourly,
        events,
        ancillary,
      });
    }
    
    // Revenue mix for pie chart
    const revenueMix = [
      { name: 'Membership', value: membershipY1, color: colors.membership },
      { name: 'Hourly Services', value: hourlyY1, color: colors.hourly },
      { name: 'Events', value: eventsY1, color: colors.events },
      { name: 'Ancillary', value: ancillaryY1, color: colors.ancillary },
    ];
    
    // 3-year comparison
    const yearComparison = [
      { year: 'Year 1', revenue: totalRevenueY1, expenses: totalExpensesY1, net: netIncomeY1, cumulative: cumulativeY1 },
      { year: 'Year 2', revenue: totalRevenueY2, expenses: totalExpensesY2, net: netIncomeY2, cumulative: cumulativeY2 },
      { year: 'Year 3', revenue: totalRevenueY3, expenses: totalExpensesY3, net: netIncomeY3, cumulative: cumulativeY3 },
    ];
    
    return {
      totalStartup,
      contingency,
      monthlyFixed,
      monthlyStaffing,
      totalRevenueY1, totalExpensesY1, netIncomeY1, cumulativeY1, marginY1,
      totalRevenueY2, totalExpensesY2, netIncomeY2, cumulativeY2, marginY2,
      totalRevenueY3, totalExpensesY3, netIncomeY3, cumulativeY3, marginY3,
      membershipY1, hourlyY1, eventsY1, ancillaryY1,
      liveRoomNet, controlRoomNet, totalCapacity,
      totalHoursRequired, utilizationRequired,
      totalTAM, projectedMembers, tamRevenueEstimate,
      monthlyData, revenueMix, yearComparison,
      breakEvenMonth: monthlyData.findIndex(m => m.cumulative > 0) + 1 || 'N/A',
    };
  }, [
    studentFee, studentMembers, studentGrowth, artistFee, artistMembers, artistGrowth, proFee, proMembers, proGrowth,
    rehearsalRate, rehearsalHours, rehearsalGrowth, recordingRate, recordingHours, recordingGrowth,
    lessonRate, lessonHours, lessonGrowth, lessonCommission,
    streamingRate, streamingEvents, streamingGrowth, showcaseRate, showcaseEvents, showcaseGrowth,
    corporateRate, corporateEvents, corporateGrowth,
    merchAvg, merchSales, merchGrowth, rentalAvg, rentalSales, rentalGrowth, bevAvg, bevSales, bevGrowth,
    buildout, equipment, streaming, opCapital, legal, marketing, contingencyPct,
    rent, utilities, insurance, monthlyMarketing, software, maintenance, misc,
    techDirectorRate, techDirectorHours, generalManagerRate, generalManagerHours,
    studentWorkerRate, studentWorkerHours, eventStaffRate, eventStaffHours,
    ownerDrawY2, ownerDrawY3,
    dailyHours, daysPerWeek, liveRoomLockout, utilizationTarget,
    primaryMarket, secondaryMarket, weekenders, conversionRate,
  ]);

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      color: colors.text,
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        padding: '20px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: '700',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ color: colors.accent }}>3RD</span>
              <span>SPACE</span>
              <span style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '400', marginLeft: '8px' }}>FINANCIAL MODEL</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
            <TabButton active={activeTab === 'revenue'} onClick={() => setActiveTab('revenue')}>Revenue</TabButton>
            <TabButton active={activeTab === 'costs'} onClick={() => setActiveTab('costs')}>Costs</TabButton>
            <TabButton active={activeTab === 'capacity'} onClick={() => setActiveTab('capacity')}>Capacity</TabButton>
            <TabButton active={activeTab === 'market'} onClick={() => setActiveTab('market')}>Market</TabButton>
          </div>
        </div>
        
        {/* Key Metrics Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
          <MetricCard label="Startup Investment" value={fmt(calculations.totalStartup)} color={colors.negative} tooltip="Total capital required to launch including buildout, equipment, operating capital, and contingency" tooltipPosition="below" />
          <MetricCard label="Year 1 Revenue" value={fmt(calculations.totalRevenueY1)} subvalue={`Margin: ${pct(calculations.marginY1)}`} color={colors.membership} tooltip="Projected first year revenue with 50-100% ramp-up curve over 8 months" tooltipPosition="below" />
          <MetricCard label="Year 1 Net Income" value={fmt(calculations.netIncomeY1)} color={calculations.netIncomeY1 >= 0 ? colors.positive : colors.negative} tooltip="Revenue minus all operating expenses (before owner draw)" tooltipPosition="below" />
          <MetricCard label="Year 3 Cumulative" value={fmt(calculations.cumulativeY3)} color={calculations.cumulativeY3 >= 0 ? colors.positive : colors.negative} tooltip="Total profit/loss position after 3 years including startup investment recovery" tooltipPosition="below" />
          <MetricCard label="Utilization Required" value={pct(calculations.utilizationRequired)} subvalue={`Target: ${pct(utilizationTarget)}`} color={calculations.utilizationRequired <= utilizationTarget ? colors.positive : colors.negative} tooltip="Percentage of available studio hours needed to hit revenue targets. Green = below target capacity" tooltipPosition="below" />
          <MetricCard label="Break-Even" value={calculations.breakEvenMonth > 0 && calculations.breakEvenMonth <= 12 ? `Month ${calculations.breakEvenMonth}` : 'Year 2+'} color={colors.accent} tooltip="Month when cumulative cash flow turns positive (startup costs recovered)" tooltipPosition="below" />
        </div>
      </div>

      <div style={{ display: 'flex', padding: '24px 32px', gap: '32px' }}>
        {/* Left Panel - Inputs */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          {activeTab === 'overview' && (
            <>
              <Section title="Quick Adjustments">
                <InputField label="Total Members (Student)" value={studentMembers} onChange={setStudentMembers} tooltip="Students, hobbyists, beginners. $65/mo tier with basic access" />
                <InputField label="Total Members (Artist)" value={artistMembers} onChange={setArtistMembers} tooltip="Working musicians, bands, semi-pros. $175/mo tier with priority booking" />
                <InputField label="Total Members (Pro)" value={proMembers} onChange={setProMembers} tooltip="Full-time professionals, producers. $350/mo tier with unlimited access" />
                <InputField label="Monthly Rent" value={rent} onChange={setRent} prefix="$" tooltip="Base rent for ~2,000 sq ft commercial space in Woodstock area" />
                <InputField label="Owner Draw Y2" value={ownerDrawY2} onChange={setOwnerDrawY2} prefix="$" tooltip="Annual salary/distribution to owner in Year 2" />
                <InputField label="Owner Draw Y3" value={ownerDrawY3} onChange={setOwnerDrawY3} prefix="$" tooltip="Annual salary/distribution to owner in Year 3" />
              </Section>
            </>
          )}
          
          {activeTab === 'revenue' && (
            <>
              <Section title="Membership Tiers">
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${colors.border}` }}>
                  <div style={{ fontSize: '12px', color: colors.accent, marginBottom: '8px', fontWeight: '600' }}>Student Tier</div>
                  <InputField label="Monthly Fee" value={studentFee} onChange={setStudentFee} prefix="$" tooltip="Entry-level tier: 4 hrs/mo live room, 2 hrs control room, off-peak hours" />
                  <InputField label="Year 1 Members" value={studentMembers} onChange={setStudentMembers} tooltip="Target: local music students, hobbyists, beginners" />
                  <InputField label="Annual Growth" value={(studentGrowth * 100).toFixed(0)} onChange={(v) => setStudentGrowth(v / 100)} suffix="%" tooltip="Year-over-year membership growth rate" />
                </div>
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${colors.border}` }}>
                  <div style={{ fontSize: '12px', color: colors.accent, marginBottom: '8px', fontWeight: '600' }}>Artist Tier</div>
                  <InputField label="Monthly Fee" value={artistFee} onChange={setArtistFee} prefix="$" tooltip="Mid-tier: 8 hrs/mo live room, 4 hrs control room, priority booking, locker" />
                  <InputField label="Year 1 Members" value={artistMembers} onChange={setArtistMembers} tooltip="Target: working musicians, local bands, semi-professionals" />
                  <InputField label="Annual Growth" value={(artistGrowth * 100).toFixed(0)} onChange={(v) => setArtistGrowth(v / 100)} suffix="%" tooltip="Year-over-year membership growth rate" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: colors.accent, marginBottom: '8px', fontWeight: '600' }}>Professional Tier</div>
                  <InputField label="Monthly Fee" value={proFee} onChange={setProFee} prefix="$" tooltip="Top tier: 16 hrs/mo live room, 8 hrs control room, 24/7 access, storage, guest passes" />
                  <InputField label="Year 1 Members" value={proMembers} onChange={setProMembers} tooltip="Target: touring musicians, producers, recording professionals" />
                  <InputField label="Annual Growth" value={(proGrowth * 100).toFixed(0)} onChange={(v) => setProGrowth(v / 100)} suffix="%" tooltip="Year-over-year membership growth rate" />
                </div>
              </Section>
              
              <Section title="Hourly Services" defaultOpen={false}>
                <InputField label="Rehearsal Rate/Hr" value={rehearsalRate} onChange={setRehearsalRate} prefix="$" tooltip="Non-member hourly rate for live room rehearsal space" />
                <InputField label="Rehearsal Hours/Mo" value={rehearsalHours} onChange={setRehearsalHours} tooltip="Projected monthly non-member rehearsal bookings" />
                <InputField label="Recording Rate/Hr" value={recordingRate} onChange={setRecordingRate} prefix="$" tooltip="Control room rate including basic engineering assistance" />
                <InputField label="Recording Hours/Mo" value={recordingHours} onChange={setRecordingHours} tooltip="Projected monthly recording session hours" />
                <InputField label="Lesson Rate/Hr" value={lessonRate} onChange={setLessonRate} prefix="$" tooltip="Average rate for private lessons (guitar, drums, voice, etc.)" />
                <InputField label="Lesson Hours/Mo" value={lessonHours} onChange={setLessonHours} tooltip="Total monthly lesson hours across all instructors" />
                <InputField label="Lesson Commission" value={(lessonCommission * 100).toFixed(0)} onChange={(v) => setLessonCommission(v / 100)} suffix="%" tooltip="3rd Space's cut of lesson revenue (instructors keep the rest)" />
              </Section>
              
              <Section title="Events & Streaming" defaultOpen={false}>
                <InputField label="Streaming Rate/Event" value={streamingRate} onChange={setStreamingRate} prefix="$" tooltip="Live streaming sessions for artists (YouTube, Twitch, social media)" />
                <InputField label="Streaming Events/Mo" value={streamingEvents} onChange={setStreamingEvents} tooltip="Monthly live stream productions" />
                <InputField label="Showcase Rate/Event" value={showcaseRate} onChange={setShowcaseRate} prefix="$" tooltip="Live performance showcases, listening parties, album releases" />
                <InputField label="Showcase Events/Mo" value={showcaseEvents} onChange={setShowcaseEvents} tooltip="Monthly showcase/performance events" />
                <InputField label="Corporate Rate/Event" value={corporateRate} onChange={setCorporateRate} prefix="$" tooltip="Corporate bookings: team events, podcasts, video production" />
                <InputField label="Corporate Events/Mo" value={corporateEvents} onChange={setCorporateEvents} tooltip="Monthly corporate/commercial bookings" />
              </Section>
              
              <Section title="Ancillary Revenue" defaultOpen={false}>
                <InputField label="Merch Avg Sale" value={merchAvg} onChange={setMerchAvg} prefix="$" tooltip="3rd Space branded merch: shirts, hats, stickers, accessories" />
                <InputField label="Merch Sales/Mo" value={merchSales} onChange={setMerchSales} tooltip="Monthly merchandise transactions" />
                <InputField label="Equipment Rental Avg" value={rentalAvg} onChange={setRentalAvg} prefix="$" tooltip="Backline rental: amps, mics, cables, specialty gear" />
                <InputField label="Rentals/Mo" value={rentalSales} onChange={setRentalSales} tooltip="Monthly equipment rental transactions" />
                <InputField label="Beverage Avg Sale" value={bevAvg} onChange={setBevAvg} prefix="$" tooltip="Coffee, water, energy drinks, snacks" />
                <InputField label="Beverage Sales/Mo" value={bevSales} onChange={setBevSales} tooltip="Monthly beverage/snack sales" />
              </Section>
            </>
          )}
          
          {activeTab === 'costs' && (
            <>
              <Section title="Startup Costs">
                <InputField label="Space Buildout" value={buildout} onChange={setBuildout} prefix="$" step={1000} tooltip="Acoustic treatment, soundproofing, HVAC, electrical, flooring, paint" />
                <InputField label="Equipment" value={equipment} onChange={setEquipment} prefix="$" step={1000} tooltip="PA system, monitors, mics, stands, cables, backline instruments" />
                <InputField label="Streaming Setup" value={streaming} onChange={setStreaming} prefix="$" step={500} tooltip="Cameras, capture cards, lighting, streaming PC, software licenses" />
                <InputField label="Operating Capital" value={opCapital} onChange={setOpCapital} prefix="$" step={1000} tooltip="Cash reserve for first 3-6 months of operations before revenue stabilizes" />
                <InputField label="Legal & Permits" value={legal} onChange={setLegal} prefix="$" step={500} tooltip="LLC formation, contracts, permits, insurance deposits, accounting setup" />
                <InputField label="Initial Marketing" value={marketing} onChange={setMarketing} prefix="$" step={500} tooltip="Website, branding, launch campaign, signage, grand opening event" />
                <InputField label="Contingency %" value={(contingencyPct * 100).toFixed(0)} onChange={(v) => setContingencyPct(v / 100)} suffix="%" tooltip="Buffer for unexpected costs (industry standard: 10-20%)" />
                <div style={{ marginTop: '12px', padding: '12px', background: colors.bg, borderRadius: '4px' }}>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px' }}>TOTAL STARTUP</div>
                  <div style={{ fontSize: '20px', fontFamily: "'JetBrains Mono', monospace", color: colors.accent }}>{fmt(calculations.totalStartup)}</div>
                </div>
              </Section>
              
              <Section title="Monthly Operating">
                <InputField label="Rent" value={rent} onChange={setRent} prefix="$" tooltip="Base rent for ~2,000 sq ft commercial space. Woodstock/Kingston area rates" />
                <InputField label="Utilities" value={utilities} onChange={setUtilities} prefix="$" tooltip="Electric (high for HVAC/equipment), gas, water, internet" />
                <InputField label="Insurance" value={insurance} onChange={setInsurance} prefix="$" tooltip="General liability, property, equipment coverage" />
                <InputField label="Marketing" value={monthlyMarketing} onChange={setMonthlyMarketing} prefix="$" tooltip="Social media ads, local partnerships, content creation, events" />
                <InputField label="Software" value={software} onChange={setSoftware} prefix="$" tooltip="Booking system, accounting, DAW licenses, streaming subscriptions" />
                <InputField label="Maintenance" value={maintenance} onChange={setMaintenance} prefix="$" tooltip="Equipment repairs, cleaning supplies, consumables (strings, sticks, etc.)" />
                <InputField label="Misc/Contingency" value={misc} onChange={setMisc} prefix="$" tooltip="Unexpected expenses, small purchases, petty cash" />
                <div style={{ marginTop: '12px', padding: '12px', background: colors.bg, borderRadius: '4px' }}>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px' }}>TOTAL MONTHLY FIXED</div>
                  <div style={{ fontSize: '20px', fontFamily: "'JetBrains Mono', monospace", color: colors.accent }}>{fmt(calculations.monthlyFixed)}</div>
                </div>
              </Section>
              
              <Section title="Staffing">
                <InputField label="Technical Director Rate/Hr" value={techDirectorRate} onChange={setTechDirectorRate} prefix="$" tooltip="Audio engineer, equipment maintenance, session oversight" />
                <InputField label="Technical Director Hours/Mo" value={techDirectorHours} onChange={setTechDirectorHours} tooltip="Monthly hours for technical direction and engineering" />
                <InputField label="General Manager Rate/Hr" value={generalManagerRate} onChange={setGeneralManagerRate} prefix="$" tooltip="Operations, scheduling, member relations, business development" />
                <InputField label="General Manager Hours/Mo" value={generalManagerHours} onChange={setGeneralManagerHours} tooltip="Monthly hours for management and operations" />
                <InputField label="Student Worker Rate/Hr" value={studentWorkerRate} onChange={setStudentWorkerRate} prefix="$" tooltip="Part-time staff for front desk, cleaning, basic studio assistance" />
                <InputField label="Student Worker Hours/Mo" value={studentWorkerHours} onChange={setStudentWorkerHours} tooltip="Total monthly hours across all part-time workers" />
                <InputField label="Event Staff Rate/Hr" value={eventStaffRate} onChange={setEventStaffRate} prefix="$" tooltip="Contract help for events, streaming, load-in/load-out" />
                <InputField label="Event Staff Hours/Mo" value={eventStaffHours} onChange={setEventStaffHours} tooltip="Variable hours based on event schedule" />
                <div style={{ marginTop: '12px', padding: '12px', background: colors.bg, borderRadius: '4px' }}>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px' }}>TOTAL MONTHLY STAFFING</div>
                  <div style={{ fontSize: '20px', fontFamily: "'JetBrains Mono', monospace", color: colors.accent }}>{fmt(calculations.monthlyStaffing)}</div>
                </div>
              </Section>
              
              <Section title="Owner Draw" defaultOpen={false}>
                <InputField label="Year 2 Draw" value={ownerDrawY2} onChange={setOwnerDrawY2} prefix="$" step={5000} tooltip="Owner salary/distribution once business is stable (Year 2)" />
                <InputField label="Year 3 Draw" value={ownerDrawY3} onChange={setOwnerDrawY3} prefix="$" step={5000} tooltip="Owner salary/distribution at full operation (Year 3)" />
              </Section>
            </>
          )}
          
          {activeTab === 'capacity' && (
            <>
              <Section title="Operating Hours">
                <InputField label="Hours/Day" value={dailyHours} onChange={setDailyHours} min={8} tooltip="Daily operating hours (typical: 10am-10pm = 12 hrs)" />
                <InputField label="Days/Week" value={daysPerWeek} onChange={setDaysPerWeek} min={5} max={7} tooltip="Operating days per week" />
                <InputField label="Event Lockout Hrs/Mo" value={liveRoomLockout} onChange={setLiveRoomLockout} tooltip="Live room hours reserved for events/showcases (unavailable for regular booking)" />
                <InputField label="Target Utilization" value={(utilizationTarget * 100).toFixed(0)} onChange={(v) => setUtilizationTarget(v / 100)} suffix="%" tooltip="Healthy utilization target. Above 70% may indicate need for expansion" />
              </Section>
              
              <Section title="Capacity Results">
                <div style={{ padding: '12px', background: colors.bg, borderRadius: '4px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px' }}>LIVE ROOM NET HRS/MO</div>
                  <div style={{ fontSize: '20px', fontFamily: "'JetBrains Mono', monospace", color: colors.accent }}>{calculations.liveRoomNet.toFixed(0)}</div>
                </div>
                <div style={{ padding: '12px', background: colors.bg, borderRadius: '4px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px' }}>CONTROL ROOM NET HRS/MO</div>
                  <div style={{ fontSize: '20px', fontFamily: "'JetBrains Mono', monospace", color: colors.accent }}>{calculations.controlRoomNet.toFixed(0)}</div>
                </div>
                <div style={{ padding: '12px', background: colors.bg, borderRadius: '4px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px' }}>TOTAL CAPACITY</div>
                  <div style={{ fontSize: '20px', fontFamily: "'JetBrains Mono', monospace", color: colors.accent }}>{calculations.totalCapacity.toFixed(0)} hrs</div>
                </div>
                <div style={{ padding: '12px', background: colors.bg, borderRadius: '4px' }}>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px' }}>HOURS REQUIRED</div>
                  <div style={{ fontSize: '20px', fontFamily: "'JetBrains Mono', monospace", color: calculations.utilizationRequired <= utilizationTarget ? colors.positive : colors.negative }}>
                    {calculations.totalHoursRequired.toFixed(0)} hrs ({pct(calculations.utilizationRequired)})
                  </div>
                </div>
              </Section>
            </>
          )}
          
          {activeTab === 'market' && (
            <>
              <Section title="Market Size">
                <InputField label="Primary Market (10 min)" value={primaryMarket} onChange={setPrimaryMarket} tooltip="Woodstock (town), Saugerties, Phoenicia/Shandaken - musicians within 10 min drive" />
                <InputField label="Secondary Market (20-30 min)" value={secondaryMarket} onChange={setSecondaryMarket} tooltip="Kingston, New Paltz, Rhinebeck, Catskill - musicians within 20-30 min drive" />
                <InputField label="Weekenders" value={weekenders} onChange={setWeekenders} tooltip="NYC-based musicians with weekend homes in the Hudson Valley/Catskills" />
                <InputField label="Conversion Rate" value={(conversionRate * 100).toFixed(1)} onChange={(v) => setConversionRate(v / 100)} suffix="%" step={0.1} tooltip="% of addressable musicians who become members. 1-2% is conservative for niche services" />
              </Section>
              
              <Section title="Market Results">
                <div style={{ padding: '12px', background: colors.bg, borderRadius: '4px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px' }}>TOTAL ADDRESSABLE MUSICIANS</div>
                  <div style={{ fontSize: '20px', fontFamily: "'JetBrains Mono', monospace", color: colors.accent }}>{calculations.totalTAM.toLocaleString()}</div>
                </div>
                <div style={{ padding: '12px', background: colors.bg, borderRadius: '4px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px' }}>PROJECTED MEMBERS</div>
                  <div style={{ fontSize: '20px', fontFamily: "'JetBrains Mono', monospace", color: colors.accent }}>{calculations.projectedMembers.toFixed(0)}</div>
                </div>
                <div style={{ padding: '12px', background: colors.bg, borderRadius: '4px' }}>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px' }}>TAM REVENUE POTENTIAL</div>
                  <div style={{ fontSize: '20px', fontFamily: "'JetBrains Mono', monospace", color: colors.accent }}>{fmt(calculations.tamRevenueEstimate)}</div>
                </div>
              </Section>
            </>
          )}
        </div>

        {/* Right Panel - Visualizations */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'overview' && (
            <>
              {/* 3-Year Summary */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>3-Year Financial Summary</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={calculations.yearComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis dataKey="year" stroke={colors.textMuted} fontSize={12} />
                    <YAxis stroke={colors.textMuted} fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '4px' }}
                      labelStyle={{ color: colors.text }}
                      formatter={(value) => fmt(value)}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill={colors.accent} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill={colors.hourly} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="net" name="Net Income" fill={colors.positive} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Cash Flow */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>Year 1 Monthly Cash Flow</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={calculations.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis dataKey="month" stroke={colors.textMuted} fontSize={12} />
                    <YAxis stroke={colors.textMuted} fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '4px' }}
                      labelStyle={{ color: colors.text }}
                      formatter={(value) => fmt(value)}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="cumulative" name="Cumulative" stroke={colors.accent} fill={colors.accent} fillOpacity={0.2} />
                    <Line type="monotone" dataKey="net" name="Monthly Net" stroke={colors.positive} strokeWidth={2} dot={{ fill: colors.positive }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Mix */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>Year 1 Revenue Mix</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={calculations.revenueMix}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {calculations.revenueMix.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '4px' }}
                        formatter={(value) => fmt(value)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>Key Assumptions</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                      <span style={{ color: colors.textMuted }}>Total Members (Y1)</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{studentMembers + artistMembers + proMembers}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                      <span style={{ color: colors.textMuted }}>Avg Member Value</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(calculations.membershipY1 / (studentMembers + artistMembers + proMembers) / 12)}/mo</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                      <span style={{ color: colors.textMuted }}>Monthly Fixed Costs</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(calculations.monthlyFixed)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                      <span style={{ color: colors.textMuted }}>Capacity Utilization</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: calculations.utilizationRequired <= utilizationTarget ? colors.positive : colors.negative }}>{pct(calculations.utilizationRequired)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                      <span style={{ color: colors.textMuted }}>Payback Period</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{calculations.cumulativeY1 >= 0 ? 'Year 1' : calculations.cumulativeY2 >= 0 ? 'Year 2' : 'Year 3+'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'revenue' && (
            <>
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>Monthly Revenue Breakdown</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={calculations.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis dataKey="month" stroke={colors.textMuted} fontSize={12} />
                    <YAxis stroke={colors.textMuted} fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                    <Tooltip
                      contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '4px' }}
                      labelStyle={{ color: colors.text }}
                      formatter={(value) => fmt(value)}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="membership" name="Membership" stackId="1" stroke={colors.membership} fill={colors.membership} fillOpacity={0.8} />
                    <Area type="monotone" dataKey="hourly" name="Hourly Services" stackId="1" stroke={colors.hourly} fill={colors.hourly} fillOpacity={0.8} />
                    <Area type="monotone" dataKey="events" name="Events" stackId="1" stroke={colors.events} fill={colors.events} fillOpacity={0.8} />
                    <Area type="monotone" dataKey="ancillary" name="Ancillary" stackId="1" stroke={colors.ancillary} fill={colors.ancillary} fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <MetricCard label="Membership (Y1)" value={fmt(calculations.membershipY1)} subvalue={pct(calculations.membershipY1 / calculations.totalRevenueY1)} color={colors.membership} tooltip="Recurring monthly membership fees across all tiers" tooltipPosition="above" />
                <MetricCard label="Hourly Services (Y1)" value={fmt(calculations.hourlyY1)} subvalue={pct(calculations.hourlyY1 / calculations.totalRevenueY1)} color={colors.hourly} tooltip="Non-member rehearsal, recording sessions, and lesson commissions" tooltipPosition="above" />
                <MetricCard label="Events (Y1)" value={fmt(calculations.eventsY1)} subvalue={pct(calculations.eventsY1 / calculations.totalRevenueY1)} color={colors.events} tooltip="Streaming productions, showcases, and corporate bookings" tooltipPosition="above" />
                <MetricCard label="Ancillary (Y1)" value={fmt(calculations.ancillaryY1)} subvalue={pct(calculations.ancillaryY1 / calculations.totalRevenueY1)} color={colors.ancillary} tooltip="Merch sales, equipment rentals, beverages/snacks" tooltipPosition="above" />
              </div>
            </>
          )}

          {activeTab === 'costs' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>Startup Cost Breakdown</h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {[
                      { label: 'Buildout', value: buildout },
                      { label: 'Equipment', value: equipment },
                      { label: 'Streaming', value: streaming },
                      { label: 'Operating Capital', value: opCapital },
                      { label: 'Legal/Permits', value: legal },
                      { label: 'Marketing', value: marketing },
                      { label: 'Contingency', value: calculations.contingency },
                    ].map((item) => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', color: colors.textMuted }}>{item.label}</span>
                            <span style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>{fmt(item.value)}</span>
                          </div>
                          <div style={{ height: '4px', background: colors.bg, borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${(item.value / calculations.totalStartup) * 100}%`, height: '100%', background: colors.accent, borderRadius: '2px' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600' }}>Total Startup</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: colors.accent, fontWeight: '600' }}>{fmt(calculations.totalStartup)}</span>
                  </div>
                </div>

                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>Monthly Operating Costs</h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {[
                      { label: 'Rent', value: rent },
                      { label: 'Utilities', value: utilities },
                      { label: 'Insurance', value: insurance },
                      { label: 'Marketing', value: monthlyMarketing },
                      { label: 'Software', value: software },
                      { label: 'Maintenance', value: maintenance },
                      { label: 'Misc', value: misc },
                      { label: 'Staffing', value: calculations.monthlyStaffing },
                    ].map((item) => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', color: colors.textMuted }}>{item.label}</span>
                            <span style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>{fmt(item.value)}</span>
                          </div>
                          <div style={{ height: '4px', background: colors.bg, borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${(item.value / (calculations.monthlyFixed + calculations.monthlyStaffing)) * 100}%`, height: '100%', background: colors.hourly, borderRadius: '2px' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600' }}>Total Monthly</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: colors.accent, fontWeight: '600' }}>{fmt(calculations.monthlyFixed + calculations.monthlyStaffing)}</span>
                  </div>
                </div>
              </div>

              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>3-Year Expense Trajectory</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={calculations.yearComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis dataKey="year" stroke={colors.textMuted} fontSize={12} />
                    <YAxis stroke={colors.textMuted} fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '4px' }}
                      formatter={(value) => fmt(value)}
                    />
                    <Bar dataKey="expenses" name="Total Expenses" fill={colors.negative} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === 'capacity' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <MetricCard label="Live Room Capacity" value={`${calculations.liveRoomNet.toFixed(0)} hrs/mo`} color={colors.membership} tooltip="Net available hours after event lockouts and 15% buffer for turnover/maintenance" tooltipPosition="below" />
                <MetricCard label="Control Room Capacity" value={`${calculations.controlRoomNet.toFixed(0)} hrs/mo`} color={colors.hourly} tooltip="Recording/production room hours after minimal lockout and 15% buffer" tooltipPosition="below" />
                <MetricCard label="Total Combined" value={`${calculations.totalCapacity.toFixed(0)} hrs/mo`} color={colors.accent} tooltip="Total bookable hours across both rooms per month" tooltipPosition="below" />
              </div>

              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>Utilization Analysis</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: colors.textMuted }}>Capacity Utilization</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: calculations.utilizationRequired <= utilizationTarget ? colors.positive : colors.negative }}>
                        {pct(calculations.utilizationRequired)} required
                      </span>
                    </div>
                    <div style={{ height: '24px', background: colors.bg, borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        width: `${Math.min(calculations.utilizationRequired * 100, 100)}%`,
                        height: '100%',
                        background: calculations.utilizationRequired <= utilizationTarget ? colors.positive : calculations.utilizationRequired <= 0.8 ? colors.accent : colors.negative,
                        borderRadius: '4px',
                        transition: 'width 0.3s',
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: `${utilizationTarget * 100}%`,
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        background: colors.text,
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: colors.textMuted }}>
                      <span>0%</span>
                      <span>Target: {pct(utilizationTarget)}</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div style={{ padding: '16px', background: colors.bg, borderRadius: '4px' }}>
                    <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '8px', textTransform: 'uppercase' }}>Hours Required (Monthly)</div>
                    <div style={{ fontSize: '24px', fontFamily: "'JetBrains Mono', monospace", color: colors.text }}>{calculations.totalHoursRequired.toFixed(0)}</div>
                  </div>
                  <div style={{ padding: '16px', background: colors.bg, borderRadius: '4px' }}>
                    <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '8px', textTransform: 'uppercase' }}>Available Capacity</div>
                    <div style={{ fontSize: '24px', fontFamily: "'JetBrains Mono', monospace", color: colors.text }}>{calculations.totalCapacity.toFixed(0)}</div>
                  </div>
                </div>
              </div>

              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>Revenue at Different Utilization Levels</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { util: '40%', revenue: calculations.totalCapacity * 0.4 * 45 * 12, current: false },
                      { util: '55%', revenue: calculations.totalCapacity * 0.55 * 50 * 12, current: Math.abs(calculations.utilizationRequired - 0.55) < 0.1 },
                      { util: '70%', revenue: calculations.totalCapacity * 0.7 * 55 * 12, current: false },
                      { util: '85%', revenue: calculations.totalCapacity * 0.85 * 60 * 12, current: false },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis dataKey="util" stroke={colors.textMuted} fontSize={12} />
                    <YAxis stroke={colors.textMuted} fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '4px' }}
                      formatter={(value) => fmt(value)}
                    />
                    <Bar dataKey="revenue" name="Annual Revenue Potential" fill={colors.accent} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === 'market' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <MetricCard label="Total Addressable Musicians" value={calculations.totalTAM.toLocaleString()} color={colors.accent} tooltip="Sum of all musician populations in primary, secondary, and weekender markets" tooltipPosition="below" />
                <MetricCard label="Projected Members" value={calculations.projectedMembers.toFixed(0)} subvalue={`${pct(conversionRate)} conversion`} color={colors.positive} tooltip="Expected members based on market size and conversion rate" tooltipPosition="below" />
                <MetricCard label="Market Revenue Potential" value={fmt(calculations.tamRevenueEstimate)} color={colors.membership} tooltip="Annual revenue if projected members join at average membership rate" tooltipPosition="below" />
              </div>

              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>Market Composition</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Primary (10 min)', value: primaryMarket, color: colors.accent },
                        { name: 'Secondary (20-30 min)', value: secondaryMarket, color: colors.hourly },
                        { name: 'Weekenders', value: weekenders, color: colors.events },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      <Cell fill={colors.accent} />
                      <Cell fill={colors.hourly} />
                      <Cell fill={colors.events} />
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '4px' }}
                      formatter={(value) => value.toLocaleString()}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: colors.textMuted }}>Conversion Sensitivity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[0.5, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0].map(rate => ({
                      rate: `${rate}%`,
                      members: Math.round(calculations.totalTAM * (rate / 100)),
                      revenue: calculations.totalTAM * (rate / 100) * ((studentFee + artistFee + proFee) / 3) * 12,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis dataKey="rate" stroke={colors.textMuted} fontSize={12} label={{ value: 'Conversion Rate', position: 'bottom', fill: colors.textMuted }} />
                    <YAxis yAxisId="left" stroke={colors.textMuted} fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke={colors.textMuted} fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '4px' }}
                      formatter={(value, name) => name === 'revenue' ? fmt(value) : value}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="members" name="Members" stroke={colors.accent} strokeWidth={2} dot={{ fill: colors.accent }} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke={colors.positive} strokeWidth={2} dot={{ fill: colors.positive }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 32px',
        borderTop: `1px solid ${colors.border}`,
        background: colors.surface,
        fontSize: '11px',
        color: colors.textMuted,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>3RD SPACE WOODSTOCK • Financial Planning Model</span>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>All inputs are editable • Changes update in real-time</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSaveLoadModal({ open: true, mode: 'save' })}
              style={{
                padding: '6px 16px',
                background: colors.accent,
                border: 'none',
                borderRadius: '4px',
                color: colors.bg,
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Save
            </button>
            <button
              onClick={() => setSaveLoadModal({ open: true, mode: 'load' })}
              style={{
                padding: '6px 16px',
                background: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: '4px',
                color: colors.text,
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Load
            </button>
          </div>
        </div>
      </div>

      {/* Save/Load Modal */}
      <SaveLoadModal
        isOpen={saveLoadModal.open}
        mode={saveLoadModal.mode}
        onClose={() => setSaveLoadModal({ open: false, mode: 'save' })}
        onLoad={loadData}
        currentData={getCurrentData()}
      />
    </div>
  );
}
