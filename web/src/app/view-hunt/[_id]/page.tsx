import { Id } from "../../../../convex/_generated/dataModel";
import { HuntView } from "./Hunt-view";
import { SessionView } from "./Session-view";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: { _id: string };
}) {
  const sessionId = (await searchParams).session as string;
  console.log("sessionId", sessionId);
  console.log("params", params);

  if (sessionId && params._id) {
    return (
      <SessionView
        sessionId={sessionId as Id<"blindSessions">}
        huntId={params._id as Id<"huntingSessions">}
      />
    );
  }

  return <HuntView huntId={params._id as Id<"huntingSessions">} />;
}
