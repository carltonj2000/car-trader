import { NextApiRequest, NextApiResponse } from "next";

import { getPaginateCars } from "@components/getPaginatedCars";

export default async function cars(req: NextApiRequest, res: NextApiResponse) {
  const cars = await getPaginateCars(req.query);
  res.json(cars);
}
