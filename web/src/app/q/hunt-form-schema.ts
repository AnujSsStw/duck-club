import { z } from "zod";

export const HuntFormSchema = z.object({
  date: z.date({ required_error: "Start date is required" }),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .required({ lat: true, lng: true })
    .refine((data) => data.lat !== 0 && data.lng !== 0, {
      message: "Location is required",
    }),
  timeSlot: z.string({ required_error: "Time slot is required" }),

  blindSessions: z
    .array(
      z.object({
        blindId: z.string({ required_error: "Blind is required" }),
        blindLocation: z.optional(
          z.object({
            lat: z.number(),
            lng: z.number(),
          })
        ),
        huntersPresent: z
          .array(
            z.object({
              hunterID: z.string(),
            })
          )
          .min(1, { message: "At least one hunter is required" }),
        harvests: z.array(
          z.object({
            speciesId: z.string({ required_error: "Species is required" }),
            quantity: z.number({ required_error: "Quantity is required" }),
          })
        ),
        notes: z.string().optional(),
        pictures: z.any(), // Instead of z.instanceof(FileList)
      })
    )
    .min(1, { message: "At least one blind session is required" }),
});

export type HuntFormValues = z.infer<typeof HuntFormSchema>;
