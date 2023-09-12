import { z } from "zod";
const userCoursesSchema = z.object({
  id: z.number().positive(),
  active: z.boolean().default(true),
  userId: z.number().positive(),
  courseId: z.number().positive(),
});

const userCoursesCreateSchema = userCoursesSchema.omit({ id: true });
const userCoursesUpdateSchema = userCoursesCreateSchema.partial();
const userCoursesReturnSchema = userCoursesSchema;
const userCoursesReadSchema = userCoursesReturnSchema.array();

export {
  userCoursesCreateSchema,
  userCoursesSchema,
  userCoursesUpdateSchema,
  userCoursesReadSchema,
  userCoursesReturnSchema,
};
