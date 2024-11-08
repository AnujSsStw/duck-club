import { auth } from "@clerk/nextjs/server";
import { Id } from "../../../../convex/_generated/dataModel";
// import { SessionEdit } from "./Edit-session";

export default async function Page({
  params,
}: {
  params: { _id: Id<"huntingSessions"> };
}) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) return null;

  return <div>{/* <SessionEdit huntId={params._id} /> */}</div>;
}
