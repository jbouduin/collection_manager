import { Selectable } from "kysely";
import { CollectionTable } from "../../../../main/database/schema";

export type CollectionDto = Selectable<CollectionTable>;
