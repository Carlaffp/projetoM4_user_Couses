import { z } from "zod";
const courseSchema = z.object({
  id: z.number().positive(),
  name: z.string().max(15),
  description: z.string(),
});

const courseCreateSchema = courseSchema.omit({ id: true });
const courseUpdateSchema = courseCreateSchema.partial();
const courseReturnSchema = courseSchema;
const courseReadSchema = courseReturnSchema.array();

export {
  courseSchema,
  courseCreateSchema,
  courseUpdateSchema,
  courseReturnSchema,
  courseReadSchema,
};
