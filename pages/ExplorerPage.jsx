import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCw, X, PlusCircle } from 'lucide-react';
import { api } from '../api/client';
import ResourceCard from '../components/ResourceCard';
import RequestModal from '../components/RequestModal';
import ReportModal from '../components/ReportModal';
import { Link } from 'react-router-dom';

const categories = [
  'All',
  'Textbooks',
  'Electronics',
  'Lab Equipment',
  'Project Materials',
  'Stationery',
  'Sports Equipment',
  'Other',
];

const sharingTypes = ['All', 'Lend', 'Exchange', 'Donate'];
const availabilities = ['All', 'Available', 'Borrowed'];

const ExplorerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedSharingType, setSelectedSharingType] = useState(searchParams.get('type') || 'All');
  const [selectedAvailability, setSelectedAvailability] = useState(searchParams.get('availability') || 'All');
  const [sortOption, setSortOption] = useState('newest');

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [reportingResource, setReportingResource] = useState(null);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (searchTerm.trim()) query.append('search', searchTerm.trim());
      if (selectedCategory !== 'All') query.append('category', selectedCategory);
      if (selectedSharingType !== 'All') query.append('sharingType', selectedSharingType);
      if (selectedAvailability !== 'All') query.append('availability', selectedAvailability);
      if (sortOption) query.append('sort', sortOption);

      const data = await api.getResources(`?${query.toString()}`);
      setResources(data);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedSharingType, selectedAvailability, sortOption]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedSharingType('All');
    setSelectedAvailability('All');
    setSortOption('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedSharingType !== 'All' ||
    selectedAvailability !== 'All';

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Campus Resource Explorer</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Find textbooks, gear, and academic essentials available from peers on campus
          </p>
        </div>
        <Link to="/add-resource" className="btn btn-primary">
          <PlusCircle size={16} /> Share an Item
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem' }}>
        {/* Search Row */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem', fontSize: '0.95rem' }}
            placeholder="Search by title, author, course code, components (e.g., TI-84, Algorithms, Arduino)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', top: '12px', right: '12px', color: '#94a3b8' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.65rem',
            marginBottom: '0.85rem',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.825rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                backgroundColor: selectedCategory === cat ? '#2563eb' : '#f1f5f9',
                color: selectedCategory === cat ? '#ffffff' : '#475569',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#2563eb' : '#e2e8f0',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Dropdowns Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          {/* Sharing Type */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Sharing Type
            </label>
            <select
              className="form-select"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              value={selectedSharingType}
              onChange={(e) => setSelectedSharingType(e.target.value)}
            >
              {sharingTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Sharing Types' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Availability
            </label>
            <select
              className="form-select"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
            >
              {availabilities.map((a) => (
                <option key={a} value={a}>
                  {a === 'All' ? 'All Statuses' : a}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Sort Order
            </label>
            <select
              className="form-select"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Recently Added (Newest)</option>
              <option value="oldest">Oldest First</option>
              <option value="title_asc">Title (A-Z)</option>
              <option value="title_desc">Title (Z-A)</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <div style={{ alignSelf: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetFilters}
                style={{ width: '100%', height: '36px' }}
              >
                <RefreshCw size={14} /> Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Showing <strong>{resources.length}</strong> resources
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
        </p>
      </div>

      {/* Grid of Resource Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <p>Scanning campus listings...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Search size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
          <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>No Resources Found</h4>
          <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
            No listings matched your active search or filter criteria. Try searching with different keywords or clear filters.
          </p>
          <button type="button" className="btn btn-secondary" onClick={handleResetFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {resources.map((item) => (
            <ResourceCard
              key={item._id}
              resource={item}
              onRequest={(res) => setSelectedResource(res)}
              onReport={(res) => setReportingResource(res)}
            />
          ))}
        </div>
      )}

      {/* Request Modal */}
      <RequestModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        onSuccess={fetchResources}
      />

      {/* Report Modal */}
      <ReportModal
        resource={reportingResource}
        isOpen={!!reportingResource}
        onClose={() => setReportingResource(null)}
      />
    </div>
  );
};

export default ExplorerPage;
