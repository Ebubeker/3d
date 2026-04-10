'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { TeamMember } from '@/lib/supabase/types';
import { Plus, Edit, Trash2, Search, FolderOpen, GripVertical, Eye, EyeOff } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      setIsLoading(false);
      return;
    }

    setTeamMembers(data || []);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to delete team member');
      return;
    }

    setTeamMembers(teamMembers.filter((m) => m.id !== id));
    setDeleteId(null);
  };

  const handleToggleActive = async (member: TeamMember) => {
    const nextActive = !member.is_active;

    // Optimistic update
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, is_active: nextActive } : m))
    );

    const supabase = createClient();
    const { error } = await supabase
      .from('team_members')
      .update({ is_active: nextActive })
      .eq('id', member.id);

    if (error) {
      console.error('Error toggling active state:', error);
      alert('Failed to update member status');
      // Rollback
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, is_active: member.is_active } : m))
      );
    }
  };

  const persistOrder = async (ordered: TeamMember[]) => {
    setSavingOrder(true);
    setOrderError(null);

    const supabase = createClient();
    // Write updated display_order for every member in parallel
    const updates = ordered.map((member, index) =>
      supabase
        .from('team_members')
        .update({ display_order: index + 1 })
        .eq('id', member.id)
    );

    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);

    if (failed?.error) {
      console.error('Error saving order:', failed.error);
      setOrderError('Failed to save order. Please refresh and try again.');
    }

    setSavingOrder(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Only allow reordering when not searching — otherwise indexes are confusing
    if (searchQuery) return;

    const oldIndex = teamMembers.findIndex((m) => m.id === active.id);
    const newIndex = teamMembers.findIndex((m) => m.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(teamMembers, oldIndex, newIndex).map((m, i) => ({
      ...m,
      display_order: i + 1,
    }));

    setTeamMembers(reordered);
    persistOrder(reordered);
  };

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isReorderable = !searchQuery;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">
            Drag to reorder. Use the eye icon to freeze or unfreeze a member.
          </p>
        </div>
        <Link
          href="/admin/dashboard/team/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, or location..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
          />
        </div>
        {searchQuery && (
          <p className="text-xs text-gray-500 mt-2">
            Drag-to-reorder is disabled while searching. Clear the search to reorder.
          </p>
        )}
      </div>

      {/* Save indicator */}
      {(savingOrder || orderError) && (
        <div
          className={`mb-4 px-4 py-2 rounded-lg text-sm ${
            orderError
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          }`}
        >
          {orderError ?? 'Saving order...'}
        </div>
      )}

      {/* Team Members List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team members...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'No team members found matching your search.' : 'No team members yet.'}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/dashboard/team/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Team Member
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredMembers.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <SortableMemberRow
                    key={member.id}
                    member={member}
                    reorderable={isReorderable}
                    onDelete={() => setDeleteId(member.id)}
                    onToggleActive={() => handleToggleActive(member)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Team Member?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. This will permanently delete the team member and all their portfolio items.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SortableMemberRowProps {
  member: TeamMember;
  reorderable: boolean;
  onDelete: () => void;
  onToggleActive: () => void;
}

function SortableMemberRow({
  member,
  reorderable,
  onDelete,
  onToggleActive,
}: SortableMemberRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id, disabled: !reorderable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 sm:px-6 py-4 hover:bg-gray-50 ${
        !member.is_active ? 'bg-gray-50' : ''
      }`}
    >
      {/* Drag Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={!reorderable}
        className={`shrink-0 p-1 text-gray-400 hover:text-gray-700 transition-colors ${
          reorderable ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-30'
        }`}
        title={reorderable ? 'Drag to reorder' : 'Clear search to reorder'}
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
          {member.portrait ? (
            <img
              src={member.portrait}
              alt={member.name}
              className={`w-full h-full object-cover ${!member.is_active ? 'grayscale' : ''}`}
            />
          ) : (
            <span className="text-sm font-bold text-gray-500">
              {member.name.split(' ').map((n) => n[0]).join('')}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-medium truncate ${member.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
              {member.name}
            </p>
            {!member.is_active && (
              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                Frozen
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{member.role}</p>
        </div>
      </div>

      {/* Location (hidden on small screens) */}
      <div className="hidden md:block shrink-0 w-40">
        <span className="text-sm text-gray-600 truncate">{member.location}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onToggleActive}
          className={`p-2 rounded-lg transition-colors ${
            member.is_active
              ? 'text-gray-500 hover:text-amber-600 hover:bg-amber-50'
              : 'text-amber-600 hover:text-green-600 hover:bg-green-50'
          }`}
          title={member.is_active ? 'Freeze (hide from marketplace)' : 'Unfreeze (show in marketplace)'}
        >
          {member.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <Link
          href={`/admin/dashboard/team/${member.id}/portfolio`}
          className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
          title="Manage Portfolio"
        >
          <FolderOpen className="w-4 h-4" />
        </Link>
        <Link
          href={`/admin/dashboard/team/${member.id}`}
          className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
}
