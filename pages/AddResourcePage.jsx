import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Upload, Image, MapPin, Tag, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../api/client';

const categories = [
  'Textbooks',
  'Electronics',
  'Lab Equipment',
  'Project Materials',
  'Stationery',
  'Sports Equipment',
  'Other',
];

const conditions = ['Brand New', 'Like New', 'Good', 'Fair'];
const sharingTypes = ['Lend', 'Exchange', 'Donate'];

const AddResourcePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Textbooks',
    condition: 'Good',
    sharingType: 'Lend',
    pickupLocation: 'Main Campus Library',
    exchangeNotes: '',
    imageUrl: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData({ ...formData, imageUrl: '' });
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setSelectedFile(null);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.pickupLocation.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      data.append('sharingType', formData.sharingType);
      data.append('pickupLocation', formData.pickupLocation.trim());
      data.append('exchangeNotes', formData.exchangeNotes.trim());

      if (selectedFile) {
        data.append('image', selectedFile);
      } else if (formData.imageUrl.trim()) {
        data.append('imageUrl', formData.imageUrl.trim());
      }

      const created = await api.createResource(data);
      navigate(`/resources/${created._id}`);
    } catch (err) {
      setError(err.message || 'Failed to list resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', maxWidth: '780px' }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#64748b',
          fontSize: '0.875rem',
          fontWeight: 500,
          marginBottom: '1rem',
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card">
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
            List a Campus Resource
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Share textbooks, calculators, instruments, or kits with students in your college.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Item Title */}
          <div className="form-group">
            <label className="form-label">Item Name / Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. TI-84 Plus CE Graphing Calculator, CLRS 3rd Edition, Arduino Starter Kit"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category & Condition */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Item Condition *</label>
              <select
                name="condition"
                className="form-select"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                {conditions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sharing Type */}
          <div className="form-group">
            <label className="form-label">Sharing Type *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {sharingTypes.map((type) => (
                <div
                  key={type}
                  onClick={() => setFormData({ ...formData, sharingType: type })}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: formData.sharingType === type ? '#2563eb' : '#e2e8f0',
                    backgroundColor: formData.sharingType === type ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: formData.sharingType === type ? '#1d4ed8' : '#0f172a' }}>
                    {type}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {type === 'Lend' ? 'Borrow & Return' : type === 'Exchange' ? 'Swap for another item' : 'Free Give-away'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Exchange Wishlist (if exchange) */}
          {formData.sharingType === 'Exchange' && (
            <div className="form-group">
              <label className="form-label">What would you like in exchange?</label>
              <input
                type="text"
                name="exchangeNotes"
                className="form-input"
                placeholder="e.g. Looking to exchange for Physics Vol 2 textbook or soldering iron"
                value={formData.exchangeNotes}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={4}
              placeholder="Describe edition, working condition, accessories included, marks/highlights, and any specific precautions..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Pickup Location */}
          <div className="form-group">
            <label className="form-label">Designated On-Campus Pickup Location *</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input
                type="text"
                name="pickupLocation"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="e.g. Science Complex Lounge, Main Library 2nd Floor, Engineering Block B"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
              />
            </div>
            <p className="form-helper">Keep handoffs within open campus locations for maximum safety.</p>
          </div>

          {/* Image Upload or URL */}
          <div className="form-group">
            <label className="form-label">Item Photo</label>
            <div className="grid-2">
              <div>
                <label
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'block',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <Upload size={24} color="#64748b" style={{ margin: '0 auto 0.4rem' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb', display: 'block' }}>
                    Upload image from device
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PNG, JPG or WEBP (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                  Or enter Image URL:
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  className="form-input"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                />
              </div>
            </div>

            {/* Preview Box */}
            {previewUrl && (
              <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle size={15} /> Photo ready for listing
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                      setFormData({ ...formData, imageUrl: '' });
                    }}
                    style={{ fontSize: '0.75rem', color: '#ef4444', textDecoration: 'underline' }}
                  >
                    Remove photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Publishing Listing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourcePage;
