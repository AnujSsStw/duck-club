import { auth } from "@clerk/nextjs/server";

export default function Page() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) return null;

  return <h1>Hello, {userId}</h1>;
}
