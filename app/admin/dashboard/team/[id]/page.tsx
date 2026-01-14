'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { TeamMember } from '@/lib/supabase/types';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    bio: '',
    portrait: '',
    languages: [] as string[],
    specialties: [] as string[],
    tools: [] as string[],
    years_experience: 0,
  });

  const [newLanguage, setNewLanguage] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newTool, setNewTool] = useState('');

  useEffect(() => {
    const fetchMember = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        router.push('/admin/dashboard/team');
        return;
      }

      setFormData({
        name: data.name,
        role: data.role,
        location: data.location,
        bio: data.bio,
        portrait: data.portrait || '',
        languages: data.languages || [],
        specialties: data.specialties || [],
        tools: data.tools || [],
        years_experience: data.years_experience || 0,
      });
      setIsLoading(false);
    };

    fetchMember();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'years_experience' ? parseInt(value) || 0 : value,
    }));
  };

  const addItem = (field: 'languages' | 'specialties' | 'tools', value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setter('');
    }
  };

  const removeItem = (field: 'languages' | 'specialties' | 'tools', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('team_members')
        .update(formData)
        .eq('id', id);

      if (error) {
        setError(error.message);
        return;
      }

      router.push('/admin/dashboard/team');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading team member...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/dashboard/team"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Team Member</h1>
        <p className="text-gray-600 mt-1">Update {formData.name}&apos;s profile</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              <input
                type="number"
                name="years_experience"
                value={formData.years_experience}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Portrait URL</label>
              <input
                type="url"
                name="portrait"
                value={formData.portrait}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors resize-none text-black"
                required
              />
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Languages
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('languages', newLanguage, setNewLanguage))}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
                placeholder="e.g., English"
              />
              <button
                type="button"
                onClick={() => addItem('languages', newLanguage, setNewLanguage)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeItem('languages', idx)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Specialties
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('specialties', newSpecialty, setNewSpecialty))}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
                placeholder="e.g., Sportswear"
              />
              <button
                type="button"
                onClick={() => addItem('specialties', newSpecialty, setNewSpecialty)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specialties.map((spec, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => removeItem('specialties', idx)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Tools
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('tools', newTool, setNewTool))}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
                placeholder="e.g., CLO3D"
              />
              <button
                type="button"
                onClick={() => addItem('tools', newTool, setNewTool)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => removeItem('tools', idx)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Link
              href="/admin/dashboard/team"
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
