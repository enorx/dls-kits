import { useState, useCallback } from 'react';
import type { KitType } from '@/types';
import type { UseGitHubDataStoreReturn } from '@/hooks/useGitHubDataStore';
import { 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Save,
  Upload,
  X,
  Download,
  RefreshCw,
  Trophy,
  Building2,
  Shirt,
  AlertCircle,
  CheckCircle,
  Loader2,
  Github,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  dataStore: UseGitHubDataStoreReturn;
  onLogout: () => void;
}

type AdminTab = 'leagues' | 'clubs' | 'kits';

// Progress bar component
function CommitProgress({ 
  state 
}: { 
  state: { isCommitting: boolean; progress: number; message: string; error: string | null } 
}) {
  if (!state.isCommitting && !state.error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card p-6 w-full max-w-md mx-4">
        {state.isCommitting ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <h3 className="text-lg font-semibold">Saving to GitHub...</h3>
            </div>
            <div className="mb-4">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{state.progress}%</p>
            </div>
            <p className="text-sm text-muted-foreground">{state.message}</p>
          </>
        ) : state.error ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive">Commit Failed</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{state.error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full admin-btn-primary"
            >
              Retry
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

// GitHub status banner
function GitHubStatusBanner({ 
  isConfigured, 
  hasWriteAccess 
}: { 
  isConfigured: boolean; 
  hasWriteAccess: boolean 
}) {
  if (!isConfigured) {
    return (
      <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-destructive">GitHub Not Configured</p>
          <p className="text-sm text-muted-foreground mt-1">
            Set VITE_GITHUB_TOKEN, VITE_GITHUB_OWNER, and VITE_GITHUB_REPO in your .env file.
            Changes will only be saved locally until configured.
          </p>
        </div>
      </div>
    );
  }

  if (!hasWriteAccess) {
    return (
      <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-yellow-500">Read-Only Access</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your GitHub token doesn't have write access. Changes cannot be saved to the repository.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-green-500">GitHub Connected</p>
        <p className="text-sm text-muted-foreground mt-1">
          All changes will be committed directly to your repository.
        </p>
      </div>
    </div>
  );
}

export function AdminDashboard({ dataStore, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('leagues');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  // Reset form
  const resetForm = () => {
    setFormData({});
    setImagePreview(null);
    setIsAdding(false);
    setEditingItem(null);
    setExpandedItem(null);
    setIsUploading(false);
  };

  // Handle save/commit
  const handleSave = useCallback(async () => {
    const success = await dataStore.commitChanges('Update DLS KITS data via admin dashboard');
    if (success) {
      // Show success toast or notification
      alert('Changes saved successfully to GitHub!');
    }
  }, [dataStore]);

  // Export data
  const handleExport = () => {
    const data = dataStore.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dls-kits-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      alert('Only JPEG, PNG, WebP, and SVG images are allowed');
      return;
    }

    setIsUploading(true);

    try {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to GitHub
      const result = await dataStore.uploadImageToGitHub(file);
      if (result) {
        setFormData((prev: any) => ({ ...prev, [field]: result.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // League handlers
  const handleAddLeague = () => {
    if (!formData.name) {
      alert('League name is required');
      return;
    }
    dataStore.addLeague({
      name: formData.name,
      logo: formData.logo || '',
      order: dataStore.data.leagues.length + 1,
    });
    resetForm();
  };

  const handleUpdateLeague = () => {
    if (!editingItem || !formData.name) return;
    dataStore.updateLeague(editingItem.id, {
      name: formData.name,
      logo: formData.logo || editingItem.logo,
      order: parseInt(formData.order) || editingItem.order,
    });
    resetForm();
  };

  const handleDeleteLeague = (id: string) => {
    dataStore.deleteLeague(id);
    setShowConfirmDelete(null);
  };

  // Club handlers
  const handleAddClub = () => {
    if (!formData.name || !formData.leagueId) {
      alert('Club name and league are required');
      return;
    }
    dataStore.addClub({
      name: formData.name,
      logo: formData.logo || '',
      leagueId: formData.leagueId,
    });
    resetForm();
  };

  const handleUpdateClub = () => {
    if (!editingItem || !formData.name) return;
    dataStore.updateClub(editingItem.id, {
      name: formData.name,
      logo: formData.logo || editingItem.logo,
      leagueId: formData.leagueId || editingItem.leagueId,
    });
    resetForm();
  };

  const handleDeleteClub = (id: string) => {
    dataStore.deleteClub(id);
    setShowConfirmDelete(null);
  };

  // Kit handlers
  const handleAddKit = () => {
    if (!formData.name || !formData.clubId || !formData.link) {
      alert('Kit name, club, and link are required');
      return;
    }
    dataStore.addKit({
      name: formData.name,
      type: formData.type || 'Home',
      image: formData.image || '',
      link: formData.link,
      clubId: formData.clubId,
    });
    resetForm();
  };

  const handleUpdateKit = () => {
    if (!editingItem || !formData.name) return;
    dataStore.updateKit(editingItem.id, {
      name: formData.name,
      type: formData.type || editingItem.type,
      image: formData.image || editingItem.image,
      link: formData.link || editingItem.link,
      clubId: formData.clubId || editingItem.clubId,
    });
    resetForm();
  };

  const handleDeleteKit = (id: string) => {
    dataStore.deleteKit(id);
    setShowConfirmDelete(null);
  };

  // Start editing
  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setImagePreview(item.logo || item.image || null);
    setExpandedItem(item.id);
  };

  // Start adding
  const startAdd = () => {
    setIsAdding(true);
    setFormData({});
    setImagePreview(null);
  };

  // Render form fields
  const renderFormFields = () => {
    const isEditing = !!editingItem;

    switch (activeTab) {
      case 'leagues':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                League Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premier League"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                League Logo
              </label>
              <div className="flex gap-4 items-start">
                {(imagePreview || formData.logo) && (
                  <div className="relative">
                    <img
                      src={imagePreview || formData.logo}
                      alt="Preview"
                      className="w-20 h-20 object-contain bg-secondary rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, logo: '' });
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={formData.logo || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, logo: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/logo.png"
                    className="form-input"
                  />
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors text-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order || ''}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  placeholder="1"
                  min="1"
                  className="form-input"
                />
              </div>
            )}
          </div>
        );

      case 'clubs':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Club Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Manchester United"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                League <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.leagueId || ''}
                onChange={(e) => setFormData({ ...formData, leagueId: e.target.value })}
                className="form-input"
              >
                <option value="">Select League</option>
                {dataStore.data.leagues.map((league: { id: string; name: string }) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Club Logo
              </label>
              <div className="flex gap-4 items-start">
                {(imagePreview || formData.logo) && (
                  <div className="relative">
                    <img
                      src={imagePreview || formData.logo}
                      alt="Preview"
                      className="w-20 h-20 object-contain bg-secondary rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, logo: '' });
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={formData.logo || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, logo: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/logo.png"
                    className="form-input"
                  />
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors text-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'kits':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kit Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Home Kit 2024/25"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Club <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.clubId || ''}
                onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                className="form-input"
              >
                <option value="">Select Club</option>
                {dataStore.data.clubs.map((club: { id: string; name: string }) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kit Type
              </label>
              <select
                value={formData.type || 'Home'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as KitType })}
                className="form-input"
              >
                <option value="Home">Home</option>
                <option value="Away">Away</option>
                <option value="Third">Third</option>
                <option value="GK">GK</option>
                <option value="Logo">Logo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kit Link <span className="text-destructive">*</span>
              </label>
              <input
                type="url"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com/kit.zip"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kit Image
              </label>
              <div className="flex gap-4 items-start">
                {(imagePreview || formData.image) && (
                  <div className="relative">
                    <img
                      src={imagePreview || formData.image}
                      alt="Preview"
                      className="w-24 h-32 object-contain bg-secondary rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, image: '' });
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/kit.png"
                    className="form-input"
                  />
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors text-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'image')}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render item list
  const renderItemList = () => {
    switch (activeTab) {
      case 'leagues':
        return dataStore.data.leagues
          .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
          .map((league: { id: string; name: string; logo: string; order: number }) => (
            <div key={league.id} className="glass-card overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedItem(expandedItem === league.id ? null : league.id)}
              >
                <img
                  src={league.logo || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="60">🏆</text></svg>'}
                  alt={league.name}
                  className="w-12 h-12 object-contain"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{league.name}</h4>
                  <p className="text-xs text-muted-foreground">Order: {league.order}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(league);
                    }}
                    className="p-2 rounded-lg hover:bg-primary/20 text-primary transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowConfirmDelete(league.id);
                    }}
                    className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  {expandedItem === league.id ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
                </div>
              </div>

              {expandedItem === league.id && editingItem?.id === league.id && (
                <div className="px-4 pb-4 border-t border-white/5 pt-4">
                  {renderFormFields()}
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleUpdateLeague} className="flex-1 admin-btn-primary flex items-center justify-center gap-2">
                      <Save size={16} /> Save Changes
                    </button>
                    <button onClick={resetForm} className="admin-btn-secondary">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ));

      case 'clubs':
        return dataStore.data.clubs
          .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))
          .map((club: { id: string; name: string; logo: string; leagueId: string }) => {
            const league = dataStore.getLeagueById(club.leagueId);
            return (
              <div key={club.id} className="glass-card overflow-hidden">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedItem(expandedItem === club.id ? null : club.id)}
                >
                  <img
                    src={club.logo || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="60">🏟️</text></svg>'}
                    alt={club.name}
                    className="w-12 h-12 object-contain"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{club.name}</h4>
                    <p className="text-xs text-muted-foreground">{league?.name || 'Unknown League'}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(club); }}
                      className="p-2 rounded-lg hover:bg-primary/20 text-primary transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(club.id); }}
                      className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    {expandedItem === club.id ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
                  </div>
                </div>

                {expandedItem === club.id && editingItem?.id === club.id && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-4">
                    {renderFormFields()}
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleUpdateClub} className="flex-1 admin-btn-primary flex items-center justify-center gap-2">
                        <Save size={16} /> Save Changes
                      </button>
                      <button onClick={resetForm} className="admin-btn-secondary">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          });

      case 'kits':
        const typeOrder = ['Home', 'Away', 'Third', 'GK', 'Logo'];
        return dataStore.data.kits
          .sort((a: { type: string }, b: { type: string }) => {
            const aIndex = typeOrder.indexOf(a.type);
            const bIndex = typeOrder.indexOf(b.type);
            return aIndex - bIndex;
          })
          .map((kit: { id: string; name: string; image: string; type: string; clubId: string }) => {
            const club = dataStore.getClubById(kit.clubId);
            return (
              <div key={kit.id} className="glass-card overflow-hidden">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedItem(expandedItem === kit.id ? null : kit.id)}
                >
                  <img
                    src={kit.image || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="60">👕</text></svg>'}
                    alt={kit.name}
                    className="w-12 h-16 object-contain bg-secondary rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{kit.name}</h4>
                    <p className="text-xs text-muted-foreground">{club?.name || 'Unknown Club'} • {kit.type}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(kit); }}
                      className="p-2 rounded-lg hover:bg-primary/20 text-primary transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(kit.id); }}
                      className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    {expandedItem === kit.id ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
                  </div>
                </div>

                {expandedItem === kit.id && editingItem?.id === kit.id && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-4">
                    {renderFormFields()}
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleUpdateKit} className="flex-1 admin-btn-primary flex items-center justify-center gap-2">
                        <Save size={16} /> Save Changes
                      </button>
                      <button onClick={resetForm} className="admin-btn-secondary">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          });

      default:
        return null;
    }
  };

  const stats = {
    leagues: dataStore.data.leagues.length,
    clubs: dataStore.data.clubs.length,
    kits: dataStore.data.kits.length,
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Commit Progress Modal */}
      <CommitProgress state={dataStore.commitState} />

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this {activeTab.slice(0, -1)}? 
              {activeTab === 'leagues' && ' All associated clubs and kits will also be deleted.'}
              {activeTab === 'clubs' && ' All associated kits will also be deleted.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (activeTab === 'leagues') handleDeleteLeague(showConfirmDelete);
                  else if (activeTab === 'clubs') handleDeleteClub(showConfirmDelete);
                  else if (activeTab === 'kits') handleDeleteKit(showConfirmDelete);
                }}
                className="flex-1 admin-btn-danger"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="flex-1 admin-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="absolute inset-0 bg-[rgba(10,10,15,0.95)] backdrop-blur-xl border-b border-white/[0.06]" />
        <div className="relative px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage your DLS KITS content</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* GitHub Status */}
        <GitHubStatusBanner 
          isConfigured={dataStore.isGitHubConfigured} 
          hasWriteAccess={dataStore.hasWriteAccess} 
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card p-4 text-center">
            <Trophy size={20} className="mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{stats.leagues}</p>
            <p className="text-xs text-muted-foreground">Leagues</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Building2 size={20} className="mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{stats.clubs}</p>
            <p className="text-xs text-muted-foreground">Clubs</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Shirt size={20} className="mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{stats.kits}</p>
            <p className="text-xs text-muted-foreground">Kits</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleSave}
            disabled={!dataStore.hasWriteAccess || dataStore.commitState.isCommitting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github size={16} />
            Commit to GitHub
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm"
          >
            <Download size={16} />
            Export JSON
          </button>
          <button
            onClick={() => dataStore.refreshData()}
            disabled={dataStore.isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={dataStore.isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <a
            href={`https://github.com/${import.meta.env.VITE_GITHUB_OWNER}/${import.meta.env.VITE_GITHUB_REPO}/blob/${import.meta.env.VITE_GITHUB_BRANCH || 'main'}/data/data.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm"
          >
            <ExternalLink size={16} />
            View on GitHub
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
          {(['leagues', 'clubs', 'kits'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); resetForm(); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Add New Button */}
        {!isAdding && (
          <button
            onClick={startAdd}
            className="w-full mb-4 py-4 rounded-xl border-2 border-dashed border-white/20 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add New {activeTab.slice(0, -1)}
          </button>
        )}

        {/* Add Form */}
        {isAdding && (
          <div className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Add New {activeTab.slice(0, -1)}</h3>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            {renderFormFields()}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  if (activeTab === 'leagues') handleAddLeague();
                  else if (activeTab === 'clubs') handleAddClub();
                  else if (activeTab === 'kits') handleAddKit();
                }}
                className="flex-1 admin-btn-primary flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add {activeTab.slice(0, -1)}
              </button>
              <button onClick={resetForm} className="admin-btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-3">
          {renderItemList()}
        </div>

        {/* Empty State */}
        {!isAdding && (
          (activeTab === 'leagues' && dataStore.data.leagues.length === 0) ||
          (activeTab === 'clubs' && dataStore.data.clubs.length === 0) ||
          (activeTab === 'kits' && dataStore.data.kits.length === 0)
        ) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Plus size={28} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No {activeTab} yet. Click "Add New" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
