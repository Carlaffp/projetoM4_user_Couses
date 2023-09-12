import { z } from "zod";
import { sessionCreate } from "../schemas/session.schemas";

type SessionCreat = z.infer<typeof sessionCreate>;
type SessionReturn = { token: string };

export { SessionCreat, SessionReturn };
