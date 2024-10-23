import { usePathname, useSearchParams } from 'next/navigation';
import { HuntView } from './Hunt-view';
import { SessionView } from './Session-view';
import { Id } from '../../../../convex/_generated/dataModel';


export default async function Page({
    searchParams,
    params,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    params: { _id: string }
}) {
    const sessionId = (await searchParams).session as string

    if (sessionId){
        return <SessionView sessionId={sessionId} huntId={params._id as Id<"huntsAllData">} />
    }

    return <HuntView huntId={params._id as Id<"huntsAllData">} />
}