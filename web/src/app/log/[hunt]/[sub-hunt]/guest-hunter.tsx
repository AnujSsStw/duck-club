import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export function GuestHunter() {
    const guestRef = useRef<HTMLInputElement>(null);
    const addGuestHunter = useMutation(api.users.addGuestHunter);

    return <div className="flex justify-center items-center my-4">
        <Dialog>

            <DialogTrigger className="px-4 py-2 rounded-md border border-gray-700 
                hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600
                hover:text-white transition-all duration-300 ease-in-out">
                Create a Guest Hunter
            </DialogTrigger>            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter the name of the hunter</DialogTitle>
                </DialogHeader>
                <Input
                    type="text"
                    placeholder="Name"
                    ref={guestRef}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            onClick={() => {
                                if (guestRef.current) {
                                    addGuestHunter({ name: guestRef.current.value });
                                }
                            }}
                        >
                            Create
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>;
}
