import React from "react";
import { Grid } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { PaginationRenderItemParams } from "@material-ui/lab";
import { GetServerSideProps } from "next";
import { getAsString } from "@components/getAsString";
import { getMakes, Make } from "@components/getMakes";
import { getModels, Model } from "@components/getModels";
import { CarModel } from "@components/carModel";
import Search from "./index";
import { getPaginateCars } from "@components/getPaninatedCars";
import { useRouter } from "next/router";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";

export interface CarsProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}

function Cars({ makes, models, cars, totalPages }: CarsProps) {
  const { query } = useRouter();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid item xs={12} sm={7} md={9} lg={10}>
        <Pagination
          page={parseInt(getAsString(query.page) || "1")}
          count={totalPages}
          renderItem={(item) => (
            <PaginationItem
              component={MaterialUiLink}
              query={query}
              item={item}
              {...item}
            />
          )}
        />
        <pre style={{ fontSize: "2.5rem" }}>
          {JSON.stringify({ totalPages, cars }, null, 2)}
        </pre>
      </Grid>
    </Grid>
  );
}

export default Cars;

interface MaterialUiLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}
function MaterialUiLink({ item, query, ...props }: MaterialUiLinkProps) {
  return (
    <Link
      href={{
        pathname: "/cars",
        query: { ...query, page: item.page },
      }}
    >
      <a {...props}></a>
    </Link>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginateCars(ctx.query),
  ]);
  return { props: { makes, models, ...pagination } };
};
