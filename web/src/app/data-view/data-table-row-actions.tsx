"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface DataTableRowActionsProps<
  TData extends { _id: string; timeSlot: string; blindSessionId: string },
> {
  row: Row<TData>;
}

export function DataTableRowActions<
  TData extends { _id: string; timeSlot: string; blindSessionId: string },
>({ row }: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const deleteSession = useMutation(api.q.deleteSession);

  const handleEdit = useCallback(() => {
    router.push(`/edit-hunt/${row.original._id}`);
  }, [row.original]);

  const handleView = useCallback(() => {
    if (row.original.timeSlot) {
      router.push(
        `/view-hunt/${row.original._id}?session=${row.original.blindSessionId}`
      );
    }
  }, [row.original]);

  const handleViewHunt = useCallback(() => {
    router.push(`/view-hunt/${row.original._id}`);
  }, [row.original]);

  const handleDeleteSession = useCallback(async () => {
    await deleteSession({
      sessionId: row.original.blindSessionId as Id<"blindSessions">,
    });
  }, []);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {/* <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem> */}
          <DropdownMenuItem onClick={handleView}>View Session</DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem className="bg-red-600">Delete</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewHunt}>
            View Hunt
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* for delete */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={handleDeleteSession}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
