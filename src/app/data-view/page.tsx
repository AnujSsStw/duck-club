"use client";
import { useQuery } from "convex/react";
import { DataTable } from "./data-table";
import { api } from "../../../convex/_generated/api";
import { getHuntsAllDataColumns, flattenHuntsData } from "./columns";
import { Loading } from "@/components/loading";

export default function Page() {
  const currentUser = useQuery(api.users.current);
  const dataViewData = useQuery(api.data_view.get, {
    hunterId: currentUser?._id,
  });

  const columns = getHuntsAllDataColumns();

  if (!currentUser || !dataViewData) return <Loading />;

  const flattenedData = flattenHuntsData(dataViewData);

  return (
    <div className="p-4">
      <h1>My Hunts</h1>
      <DataTable columns={columns} data={flattenedData} />
    </div>
  );
}
