import { NextApiRequest, NextApiResponse } from "next";

import { getModels } from "@components/getModels";
import { getAsString } from "@components/getAsString";

export default async function models(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const make = getAsString(req.query.make);
  const models = await getModels(make);
  res.json(models);
}
