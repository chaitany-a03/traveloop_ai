import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Camera, Save, Trash2, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppLayout from '../../components/layout/AppLayout';
import useAuthStore from '../../store/authStore';
import { authAPI } from '../../api';

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      if (photoFile) fd.append('profile_photo', photoFile);
      const res = await authAPI.updateProfile(fd);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await authAPI.deleteAccount();
      logout();
      navigate('/login');
      toast.success('Account deleted');
    } catch { toast.error('Failed to delete account'); }
  };

  const avatarSrc = photoPreview || (user?.profile_photo ? `http://localhost:5000${user.profile_photo}` : null);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-ghost p-2"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="page-header">Profile & Settings</h1>
        </div>

        {/* Avatar */}
        <div className="card p-8 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
              {avatarSrc
                ? <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                : <span className="text-white font-bold text-3xl">{user?.name?.[0]?.toUpperCase()}</span>
              }
            </div>
            <button onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Edit form */}
        <div className="card p-6">
          <h2 className="section-title mb-5 flex items-center gap-2"><User className="w-5 h-5" /> Personal Information</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className="input-field pl-10" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" className="input-field pl-10" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <button type="submit" disabled={isSaving} className="btn-primary w-full">
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border border-red-200">
          <h2 className="section-title text-red-600 mb-2 flex items-center gap-2"><Shield className="w-5 h-5" /> Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. All your trips and data will be permanently deleted.</p>
          {showDeleteConfirm ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-red-600">Are you absolutely sure?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
                <button onClick={handleDelete} className="btn-danger flex-1 text-sm">Yes, delete my account</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger text-sm">
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
