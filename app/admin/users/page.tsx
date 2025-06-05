"use client";
import UserManagement from '../../components/UserManagement';

export default function UsersPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <UserManagement open={true} onClose={() => {}} />
    </div>
  );
} 