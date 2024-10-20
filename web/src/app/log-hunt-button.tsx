import MapComp from "@/components/map/map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { useMediaQuery } from "@/components/use-media-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarForm } from "./log-hunt/date-picker";

export function LogHuntButton() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Log Hunt
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[70%] overflow-y-scroll max-h-screen h-[80%]">
          <DialogHeader>
            <DialogTitle>Log Hunt</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Log Hunt</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Log Hunt</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const FormSchema = z.object({
  date: z.date({ required_error: "Start date is required" }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

function ProfileForm({ className }: React.ComponentProps<"form">) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: undefined,
      location: { lat: 0, lng: 0 },
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col justify-center"
      >
        <div className="grid gap-2">
          <MapComp form={form} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hunt Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <MapComp form={form} /> */}

            <div className="flex space-x-4">
              <div className="flex-1">
                <CalendarForm form={form} label="Date" name="date" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Button type="submit">Create Hunt</Button>
      </form>
    </Form>
  );
}
