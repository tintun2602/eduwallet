interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}

export default function SearchSection({
  searchTerm,
  onSearchChange,
  placeholder = "",
  hint = "Search your students by ID or name and surname",
}: SearchSectionProps) {
  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-icon">
          <img src="/search.svg" alt="Search" className="search-icon-image" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      <p className="search-hint">{hint}</p>
    </div>
  );
}
