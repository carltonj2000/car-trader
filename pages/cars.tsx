import React from "react";
import { Grid } from "@material-ui/core";
import { GetServerSideProps } from "next";
import { getAsString } from "@components/getAsString";
import { getMakes, Make } from "@components/getMakes";
import { getModels, Model } from "@components/getModels";
import { CarModel } from "@components/carModel";
import Search from "./index";
import { getPaginateCars } from "@components/getPaginatedCars";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import useSWR from "swr";
import deepEqual from "deep-equal";
import { CarPagination } from "@components/CarPagination";
import { CarCard } from "@components/CarCard";

export interface CarsProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}

function Cars({ makes, models, cars, totalPages }: CarsProps) {
  const { query } = useRouter();
  const [serverQuery] = React.useState(query);
  const { data } = useSWR("/api/cars?" + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery) ? { cars, totalPages } : null,
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid container xs={12} sm={7} md={9} lg={10} spacing={3}>
        <Grid item xs={12}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>
        {data?.cars.map((car) => (
          <Grid key={car.id} item xs={12} sm={6}>
            <CarCard {...{ car }} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Cars;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginateCars(ctx.query),
  ]);
  return { props: { makes, models, ...pagination } };
};
