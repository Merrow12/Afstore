interface Event {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  imageUrl?: string;
  category: { name: string };
  organizer: { name: string };
}

export default function EventCard({ event }: { event: Event }) {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: 16,
      cursor: 'pointer',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      onClick={() => window.location.href = `/events/${event.id}`}
    >
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.title}
          style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, marginBottom: 12 }}
        />
      )}
      <span style={{
        background: '#ede9fe', color: '#7c3aed',
        padding: '2px 8px', borderRadius: 12, fontSize: 12
      }}>
        {event.category.name}
      </span>
      <h3 style={{ margin: '8px 0', fontSize: 16 }}>{event.title}</h3>
      <p style={{ color: '#6b7280', fontSize: 14, margin: '4px 0' }}>
        📅 {new Date(event.dateTime).toLocaleString('ru-RU')}
      </p>
      <p style={{ color: '#6b7280', fontSize: 14, margin: '4px 0' }}>
        📍 {event.location}
      </p>
      <p style={{ color: '#9ca3af', fontSize: 13, margin: '4px 0' }}>
        👤 {event.organizer.name}
      </p>
    </div>
  );
}