import { openDb } from "./openDb";

export interface Model {
  model: String;
  count: number;
}

export async function getModels(make: string) {
  const db = await openDb();
  const models = await db.all<Model[]>(
    `
    SELECT model, count(*) as count
    FROM car
    WHERE make = ?
    GROUP BY model
  `,
    make
  );
  return models;
}
