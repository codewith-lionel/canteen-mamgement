import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Settings = () => {
  const [settings, setSettings] = useState({
    canteenName: '',
    upiId: '',
    upiQrCode: '',
    contactPhone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load settings');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/settings', settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, upiQrCode: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate UPI payment string for preview
  const upiString = settings.upiId 
    ? `upi://pay?pa=${settings.upiId}&pn=${settings.canteenName || 'College Canteen'}`
    : '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Settings */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">General Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Canteen Name *</label>
                <input
                  type="text"
                  className="input"
                  value={settings.canteenName}
                  onChange={(e) => setSettings({ ...settings, canteenName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Contact Phone Number</label>
                <input
                  type="tel"
                  className="input"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          </div>

          {/* UPI Settings */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">UPI Payment Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">UPI ID *</label>
                <input
                  type="text"
                  className="input"
                  value={settings.upiId}
                  onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                  required
                  placeholder="e.g., canteen@oksbi"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your UPI ID for receiving payments
                </p>
              </div>

              <div>
                <label className="label">Upload Custom QR Code (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a custom UPI QR code image, or leave blank to auto-generate
                </p>
              </div>

              {/* QR Code Preview */}
              <div className="mt-6">
                <h3 className="font-bold mb-3">QR Code Preview:</h3>
                <div className="flex justify-center p-6 bg-white border-2 border-gray-300 rounded-lg">
                  {settings.upiQrCode ? (
                    <img 
                      src={settings.upiQrCode} 
                      alt="UPI QR Code" 
                      className="w-64 h-64"
                    />
                  ) : settings.upiId ? (
                    <div className="text-center">
                      <QRCodeSVG
                        value={upiString}
                        size={256}
                        level="H"
                        includeMargin={true}
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Auto-generated QR Code
                      </p>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      Enter UPI ID to see QR code preview
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="card">
            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary py-3 text-lg"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

        {/* Instructions */}
        <div className="card mt-8 bg-blue-50 border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">📝 Instructions:</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>The UPI ID is used to receive payments from students</li>
            <li>You can upload your own QR code image or let the system generate one automatically</li>
            <li>Make sure your UPI ID is correct before saving</li>
            <li>Test the QR code by scanning it with a UPI app before going live</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
