"use client";
import { useQuery } from 'convex/react';
import { DataTable } from './data-table';
import { api } from '../../../convex/_generated/api';
import { getHuntsAllDataColumns, flattenHuntsData } from './columns';

export default function Page() {
  const currentUser = useQuery(api.users.current);
  const huntsData = useQuery(api.huntsAllData.getHuntsAllData);

  const columns = getHuntsAllDataColumns();

  if (!currentUser || !huntsData) return <div>Loading...</div>;

  const flattenedData = flattenHuntsData(huntsData);

  // console.log(flattenedData);

  return (
    <div className='p-4'>
      <h1>My Hunts</h1>
      <DataTable columns={columns} data={flattenedData} />
    </div>
  );
}
