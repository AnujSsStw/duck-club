"use client";
import { useQuery } from 'convex/react';
import { HuntsDataTable } from './HuntsDataTable';
import { api } from '../../../convex/_generated/api';

export default function Page() {
  const currentUser = useQuery(api.users.current);

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className='p-4'>
      <h1>My Hunts</h1>
      <HuntsDataTable creatorId={currentUser._id} />
    </div>
  );
}