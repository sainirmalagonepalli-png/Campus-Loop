import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
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
const statuses = ['Available', 'Borrowed', 'Exchanged', 'Donated', 'Unavailable'];

const EditResourcePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Textbooks',
    condition: 'Good',
    sharingType: 'Lend',
    status: 'Available',
    pickupLocation: '',
    exchangeNotes: '',
    imageUrl: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const data = await api.getResourceById(id);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Textbooks',
          condition: data.condition || 'Good',
          sharingType: data.sharingType || 'Lend',
          status: data.status || 'Available',
          pickupLocation: data.pickupLocation || '',
          exchangeNotes: data.exchangeNotes || '',
          imageUrl: data.image || '',
        });
        if (data.image) setPreviewUrl(data.image);
      } catch (err) {
        setError(err.message || 'Error loading listing');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      data.append('sharingType', formData.sharingType);
      data.append('status', formData.status);
      data.append('pickupLocation', formData.pickupLocation.trim());
      data.append('exchangeNotes', formData.exchangeNotes.trim());

      if (selectedFile) {
        data.append('image', selectedFile);
      } else if (formData.imageUrl.trim()) {
        data.append('imageUrl', formData.imageUrl.trim());
      }

      await api.updateResource(id, data);
      navigate(`/resources/${id}`);
    } catch (err) {
      setError(err.message || 'Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
        <p>Loading resource for editing...</p>
      </div>
    );
  }

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
        <ArrowLeft size={16} /> Back to Details
      </button>

      <div className="card">
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Edit Resource Listing
        </h1>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Item Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Condition</label>
              <select
                name="condition"
                className="form-select"
                value={formData.condition}
                onChange={handleChange}
              >
                {conditions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Sharing Type</label>
            <select
              name="sharingType"
              className="form-select"
              value={formData.sharingType}
              onChange={handleChange}
            >
              {sharingTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Pickup Location</label>
            <input
              type="text"
              name="pickupLocation"
              className="form-input"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Photo Preview & change */}
          <div className="form-group">
            <label className="form-label">Update Photo</label>
            <div className="grid-2">
              <label
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '10px',
                  padding: '1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'block',
                  backgroundColor: '#f8fafc',
                }}
              >
                <Upload size={20} color="#64748b" style={{ margin: '0 auto 0.25rem' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb', display: 'block' }}>
                  Choose replacement file
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>

              <div>
                <input
                  type="url"
                  name="imageUrl"
                  className="form-input"
                  placeholder="Or enter new image URL..."
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setPreviewUrl(e.target.value);
                  }}
                />
              </div>
            </div>

            {previewUrl && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={previewUrl}
                  alt="Current"
                  style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Current image preview</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResourcePage;
