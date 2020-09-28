import { openDb } from "./openDb";

export interface Make {
  make: String;
  count: number;
}

export async function getMakes() {
  const db = await openDb();
  const makes = await db.all<Make[]>(`
    SELECT make, count(*) as count
    FROM car
    GROUP BY make
  `);
  return makes;
}
