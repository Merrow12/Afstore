interface FilterProps {
  onFilter: (filters: {
    search: string;
    category: string;
    dateFrom: string;
    dateTo: string;
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
    });
  };

  return (
    <form style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
      <input
        name="search"
        placeholder="🔍 Поиск по названию..."
        onChange={handleChange}
        style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', flex: 1, minWidth: 200 }}
      />
      <select
        name="category"
        onChange={handleChange}
        style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db' }}
      >
        <option value="">Все категории</option>
        <option value="lecture">Лекция</option>
        <option value="hackathon">Хакатон</option>
        <option value="sport">Спорт</option>
        <option value="culture">Культура</option>
        <option value="science">Наука</option>
      </select>
      <input
        name="dateFrom"
        type="date"
        onChange={handleChange}
        style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db' }}
      />
      <input
        name="dateTo"
        type="date"
        onChange={handleChange}
        style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db' }}
      />
    </form>
  );
}