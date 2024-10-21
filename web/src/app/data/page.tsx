import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) return null;

  const data = await fetch(`https://gallant-ant-192.convex.site/data`, {
    headers: {
      Authorization: userId,
    },
  });

  const json = await data.json();

  console.log(json);

  return (
    <div>
      Hello, {userId}
      <div>{JSON.stringify(json, null, 4)}</div>
    </div>
  );
}
