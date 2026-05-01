interface FilterProps {
  onFilter: (filters: {
    search: string;
    category: string;
    dateFrom: string;
    dateTo: string;
    minRating: string;
  }) => void;
}

export default function EventFilters({ onFilter }: FilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const form = e.currentTarget.closest('form') as HTMLFormElement;
    const data = new FormData(form);
    onFilter({
      search: data.get('search') as string || '',
      category: data.get('category') as string || '',
      dateFrom: data.get('dateFrom') as string || '',
      dateTo: data.get('dateTo') as string || '',
      minRating: data.get('minRating') as string || '',
    });
  };

  return (
    <form style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
      <input
        name="search"
        placeholder="🔍 Поиск по названию..."
        onChange={handleChange}
        style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid #b2dde8', flex: 1, minWidth: 200, fontFamily: "'Roboto', sans-serif", fontSize: 13, background: '#f4f9fb', outline: 'none' }}
      />
      <select name="category" onChange={handleChange}
        style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid #b2dde8', fontFamily: "'Roboto', sans-serif", fontSize: 13, background: '#f4f9fb', color: '#0f2a30', outline: 'none' }}>
        <option value="">Все категории</option>
        <option value="cat-1">Лекция</option>
        <option value="cat-2">Хакатон</option>
        <option value="cat-3">Спорт</option>
        <option value="cat-4">Культура</option>
        <option value="cat-5">Наука</option>
      </select>
      <input name="dateFrom" type="date" onChange={handleChange}
        style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid #b2dde8', fontFamily: "'Roboto', sans-serif", fontSize: 13, background: '#f4f9fb', outline: 'none' }}
      />
      <input name="dateTo" type="date" onChange={handleChange}
        style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid #b2dde8', fontFamily: "'Roboto', sans-serif", fontSize: 13, background: '#f4f9fb', outline: 'none' }}
      />
      <select name="minRating" onChange={handleChange}
        style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid #b2dde8', fontFamily: "'Roboto', sans-serif", fontSize: 13, background: '#f4f9fb', color: '#0f2a30', outline: 'none' }}>
        <option value="">Любой рейтинг</option>
        <option value="4">★ 4 и выше</option>
        <option value="3">★ 3 и выше</option>
        <option value="2">★ 2 и выше</option>
      </select>
    </form>
  );
}