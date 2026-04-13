'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, Pencil, UserMinus, Key, ScrollText } from 'lucide-react'
import { toast } from 'sonner'
import { formatDateTime, cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { appendAuditEntry } from '@/lib/audit-store'
import { getSessionAdminLabel } from '@/lib/admin-session'

const ADMIN_USERS = [
  { id: 'u-1', name: 'James Kariuki', email: 'james.k@ezraannex.com', role: 'SUPER_ADMIN', lastLogin: '2026-03-10T09:00:00Z', status: 'Active' },
  { id: 'u-2', name: 'Grace Mwangi', email: 'grace.m@ezraannex.com', role: 'MANAGER', lastLogin: '2026-03-10T08:45:00Z', status: 'Active' },
  { id: 'u-3', name: 'Tony Baraka', email: 'tony.b@ezraannex.com', role: 'STAFF', lastLogin: '2026-03-09T17:00:00Z', status: 'Active' },
  { id: 'u-4', name: 'Sarah Wanjiru', email: 'sarah.w@ezraannex.com', role: 'MANAGER', lastLogin: '2026-03-08T12:00:00Z', status: 'Active' },
  { id: 'u-5', name: 'Admin Demo', email: 'admin@ezraannex.com', role: 'SUPER_ADMIN', lastLogin: '2026-03-10T09:15:00Z', status: 'Active' },
]

const ROLE_STYLES: Record<string, string> = {
  SUPER_ADMIN: 'bg-navy text-white',
  MANAGER: 'bg-blue-100 text-blue-700',
  STAFF: 'bg-gray-100 text-gray-600',
}

export default function UsersPage() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('STAFF')

  const log = (action: string, entity: string, entityId: string, details: string) => {
    appendAuditEntry({
      admin: getSessionAdminLabel(),
      action,
      entity,
      entityId,
      ip: typeof window !== 'undefined' ? 'session' : '—',
      details,
    })
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-gray-600">
        <ScrollText className="w-4 h-4 text-brand shrink-0" />
        <span>User actions are appended to the</span>
        <Link href="/system/audit-log" className="text-brand font-medium hover:underline">
          audit log
        </Link>
        <span className="text-gray-400">(this browser).</span>
      </div>

      <PageHeader
        title="Users & Roles"
        subtitle="Super Admin only — create accounts and assign portal roles"
        actions={
          <button
            onClick={() => setShowInvite(true)}
            className="bg-brand text-white px-4 py-2 rounded-[7px] text-sm font-medium hover:bg-brand-light"
          >
            Invite User
          </button>
        }
      />

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Last Login</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ADMIN_USERS.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={user.name} size="sm" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', ROLE_STYLES[user.role])}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(user.lastLogin)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-gray-600">{user.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        log('UPDATE', 'User', user.id, `Role change requested for ${user.email} (demo)`)
                        toast.success('Role editor — logged to audit trail')
                      }}
                      className="p-1.5 text-gray-400 hover:text-brand rounded"
                      aria-label="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        log('UPDATE', 'User', user.id, `Deactivated ${user.email} (demo)`)
                        toast('User deactivated (demo)')
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                      aria-label="Deactivate"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        log('UPDATE', 'User', user.id, `Password reset triggered for ${user.email}`)
                        toast.success('Password reset email sent')
                      }}
                      className="p-1.5 text-gray-400 hover:text-amber-600 rounded"
                      aria-label="Reset password"
                    >
                      <Key className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInvite && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-[var(--shadow-modal)] p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Invite User</h3>
              <button onClick={() => setShowInvite(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                <input
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  type="email"
                  placeholder="user@ezraannex.com"
                  className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Role</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2"
                >
                  <option value="STAFF">Staff</option>
                  <option value="MANAGER">Manager</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowInvite(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-[7px]">
                Cancel
              </button>
              <button
                onClick={() => {
                  log('CREATE', 'UserInvite', inviteEmail || 'unknown', `Invitation sent as ${inviteRole}`)
                  setShowInvite(false)
                  toast.success(`Invitation sent to ${inviteEmail}`)
                  setInviteEmail('')
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-[7px]"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
