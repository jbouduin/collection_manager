import { Kysely } from 'kysely'

export async function v0_0_1_up(db: Kysely<any>): Promise<void> {
  console.log('updating');
  // Migration code
}

export async function v0_0_1_down(db: Kysely<any>): Promise<void> {
  // Migration code
}
