import { auth } from "@clerk/nextjs/server";
import { Id } from "../../../../convex/_generated/dataModel";
import { SessionEdit } from "./Edit-session";

async function getHuntDetails(huntId: Id<"huntsAllData">, token: string) {
    const response = await fetch(`https://gallant-ant-192.convex.site/hunt-details`, {
        headers: {
            "huntId": huntId,
            "Authorization": token
        }
    });
    return response.json();
}

export default async function Page({params}: {params: {_id: Id<"huntsAllData">}}) {
    const { userId }: { userId: string | null } = auth();

    if (!userId) return null;

    const huntDetails = await getHuntDetails(params._id, userId);



    return <div>
        <SessionEdit huntId={params._id} huntDetails={huntDetails} />
    </div>;
}
