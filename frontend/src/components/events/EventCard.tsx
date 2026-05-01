interface Event {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  imageUrl?: string;
  category: { name: string; slug: string };
  organizer: { name: string };
  avgRating?: number | null;
  reviewCount?: number;
  registrationCount?: number;
}

const categoryColors: Record<string, { bg: string; tag: string; text: string; btn: string; btnText: string }> = {
  lecture:   { bg: '#e0f5ff', tag: '#b2e0ec', text: '#1a6b7c', btn: '#e0f5ff', btnText: '#1a6b7c' },
  hackathon: { bg: '#e8f5e9', tag: '#c8e6c9', text: '#2e7d32', btn: '#e8f5e9', btnText: '#2e7d32' },
  sport:     { bg: '#fff3e0', tag: '#ffe0b2', text: '#e65100', btn: '#fff3e0', btnText: '#e65100' },
  culture:   { bg: '#fce4ec', tag: '#f8bbd0', text: '#880e4f', btn: '#fce4ec', btnText: '#880e4f' },
  science:   { bg: '#ede7f6', tag: '#d1c4e9', text: '#4527a0', btn: '#ede7f6', btnText: '#4527a0' },
};

const categoryIcons: Record<string, JSX.Element> = {
  lecture: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="10" y="16" width="36" height="28" rx="6" fill="#b2e0ec"/>
      <rect x="10" y="16" width="36" height="11" rx="6" fill="#62b6cb"/>
      <rect x="16" y="33" width="7" height="5" rx="2" fill="#1a6b7c"/>
      <rect x="25" y="30" width="7" height="8" rx="2" fill="#1a6b7c"/>
      <rect x="34" y="27" width="7" height="11" rx="2" fill="#1a6b7c"/>
    </svg>
  ),
  hackathon: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="14" y="20" width="12" height="20" rx="4" fill="#a5d6a7"/>
      <rect x="22" y="14" width="12" height="26" rx="4" fill="#4caf50"/>
      <rect x="30" y="24" width="12" height="16" rx="4" fill="#81c784"/>
      <circle cx="12" cy="16" r="3.5" fill="#2e7d32"/>
    </svg>
  ),
  sport: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="16" fill="#ffe0b2"/>
      <circle cx="28" cy="28" r="10" fill="#ffb74d"/>
      <path d="M24 28l3 3 6-6" stroke="#e65100" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  culture: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="16" y="28" width="24" height="14" rx="4" fill="#f8bbd0"/>
      <path d="M16 28 L28 16 L40 28" fill="#f48fb1"/>
      <rect x="22" y="32" width="12" height="10" rx="2" fill="#e91e63"/>
    </svg>
  ),
  science: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="12" fill="#d1c4e9"/>
      <circle cx="28" cy="28" r="7" fill="#7e57c2"/>
      <circle cx="28" cy="22" r="3" fill="#ede7f6"/>
      <circle cx="34" cy="31" r="2" fill="#ede7f6"/>
    </svg>
  ),
};

export default function EventCard({ event }: { event: Event }) {
  const slug = event.category?.slug || 'lecture';
  const colors = categoryColors[slug] || categoryColors.lecture;
  const icon = categoryIcons[slug] || categoryIcons.lecture;
  const date = new Date(event.dateTime);
  const day = date.getDate();
  const month = date.toLocaleString('ru-RU', { month: 'short' });
  const initials = event.organizer.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      onClick={() => window.location.href = `/events/${event.id}`}
      style={{ background: '#fff', border: '1px solid #e8f4f8', borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}
    >
      {/* Верх карточки */}
      <div style={{ height: 136, background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {icon}
        <div style={{ position: 'absolute', top: 12, left: 12, background: colors.tag, color: colors.text, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 8 }}>
          {event.category.name}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, background: '#fff', borderRadius: 10, padding: '5px 10px', textAlign: 'center', border: '1px solid #e8f4f8' }}>
          <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 15, fontWeight: 700, color: '#0f2a30', lineHeight: 1 }}>{day}</div>
          <div style={{ fontSize: 10, color: '#a0b8be', fontWeight: 500, textTransform: 'uppercase' }}>{month}</div>
        </div>
      </div>

      {/* Тело карточки */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 13, fontWeight: 600, color: '#0f2a30', marginBottom: 10, lineHeight: 1.4 }}>
          {event.title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#7a9ea6' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#b0c8ce" strokeWidth="1.2"/>
              <path d="M6 3.5V6l2 1.5" stroke="#b0c8ce" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {date.toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' })} — {date.toLocaleDateString('ru-RU')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#7a9ea6' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1C4.1 1 2.5 2.6 2.5 4.5 2.5 7.4 6 11 6 11s3.5-3.6 3.5-6.5C9.5 2.6 7.9 1 6 1z" stroke="#b0c8ce" strokeWidth="1.2" fill="none"/>
              <circle cx="6" cy="4.5" r="1.2" fill="#b0c8ce"/>
            </svg>
            {event.location}
          </div>
          {event.registrationCount !== undefined && event.registrationCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#7a9ea6' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="5" cy="4" r="2" stroke="#b0c8ce" strokeWidth="1.2" fill="none"/>
                <path d="M1 10c0-2.5 1.8-3.5 4-3.5s4 1 4 3.5" stroke="#b0c8ce" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              </svg>
              {event.registrationCount} записались
            </div>
          )}
        </div>

        <div style={{ height: 1, background: '#f0f7fa', marginBottom: 12 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: colors.btn, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: colors.btnText, border: `1.5px solid ${colors.tag}` }}>
              {initials}
            </div>
            <span style={{ fontSize: 12, color: '#a0b8be' }}>{event.organizer.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {event.avgRating !== null && event.avgRating !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ color: '#f59e0b', fontSize: 13 }}>★</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0f2a30' }}>{event.avgRating}</span>
                <span style={{ fontSize: 11, color: '#a0b8be' }}>({event.reviewCount})</span>
              </div>
            )}
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', background: colors.btn, color: colors.btnText, fontFamily: "'Roboto', sans-serif" }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: `${colors.btnText}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>+</div>
              Записаться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}