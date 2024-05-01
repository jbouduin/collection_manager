import { Generated } from 'kysely';

export interface CatalogItemTable {
  id: Generated<number>;
  catalogId: number;
  name: string;
}
