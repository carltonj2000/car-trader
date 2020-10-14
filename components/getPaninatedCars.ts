import { openDb } from "./openDb";
import { CarModel } from "./carModel";
import { ParsedUrlQuery } from "querystring";
import { getAsString } from "./getAsString";

const mainQuery = `
  FROM car
  WHERE (@make is NULL OR @make = make)
  AND (@model is NULL OR @model = model)
  AND (@minPrice is NULL OR @minPrice <= price)
  AND (@maxPrice is NULL OR @maxPrice >= price)
`;

export async function getPaginateCars(query: ParsedUrlQuery) {
  const db = await openDb();

  const { make, model, minPrice, maxPrice, page: pg, rowsPerPage: rpp } = query;

  const page = getValueNumber(pg) || 1;
  const rowsPerPage = getValueNumber(rpp) || 4;
  const offset = (page - 1) * rowsPerPage;
  const dbParams = {
    "@make": getValueStr(make),
    "@model": getValueStr(model),
    "@minPrice": getValueNumber(minPrice),
    "@maxPrice": getValueNumber(maxPrice),
  };

  const totalRowsPromise = db.get<{ count: number }>(
    `SELECT count(*) as count ${mainQuery}`,
    dbParams
  );
  const carsPromise = db.all<CarModel[]>(
    `SELECT * ${mainQuery} LIMIT @rowsPerPage OFFSET @offset`,
    { ...dbParams, "@rowsPerPage": rowsPerPage, "@offset": offset }
  );

  const [cars, totalRows] = await Promise.all([carsPromise, totalRowsPromise]);

  console.log("cars", dbParams, cars);
  return { cars, totalPages: Math.ceil(totalRows?.count / rowsPerPage) };
}

function getValueNumber(value: string | string[] | undefined) {
  const valStr = getValueStr(value);
  const number = parseInt(valStr);
  return isNaN(number) ? null : number;
}

function getValueStr(value: string | string[] | undefined) {
  const str = getAsString(value);
  return !str || str.toLocaleLowerCase() === "all" ? null : str;
}
