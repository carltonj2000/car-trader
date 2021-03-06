import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getMakes, Make } from "@components/getMakes";
import { getModels, Model } from "@components/getModels";
import { Formik, Form, Field, useField, useFormikContext } from "formik";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select, { SelectProps } from "@material-ui/core/Select";

import useSWR from "swr";
import { getAsString } from "@components/getAsString";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "auto",
    maxWidth: 500,
    padding: theme.spacing(3),
  },
}));

export interface HomeProps {
  makes: Make[];
  models: Model[];
  singleColumn?: boolean;
}

const prices = [500, 1000, 5000, 15000, 25000, 50000, 100000];

export default function Search({ makes, models, singleColumn }: HomeProps) {
  const classes = useStyles();
  const router = useRouter();
  const { query } = router;

  const smValue = singleColumn ? 12 : 6;
  const initialValues = {
    make: getAsString(query.make) || "all",
    model: getAsString(query.model) || "all",
    minPrice: getAsString(query.minPrice) || "all",
    maxPrice: getAsString(query.maxPrice) || "all",
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        router.push(
          {
            pathname: "/cars",
            query: { ...values, page: 1 },
          },
          undefined,
          { shallow: true }
        );
      }}
    >
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={smValue}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="search-make">Make</InputLabel>
                  <Field
                    name="make"
                    as={Select}
                    labelId="search-make"
                    label="Make"
                  >
                    <MenuItem value="all">
                      <em>All makes</em>
                    </MenuItem>
                    {makes.map(({ make, count }) => (
                      <MenuItem value={make} key={make}>
                        {make} ({count})
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <ModelSelect name="model" models={models} make={values.make} />
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="search-min-price">Min Price</InputLabel>
                  <Field
                    name="minPrice"
                    as={Select}
                    labelId="search-min-price"
                    label="minPrice"
                  >
                    <MenuItem value="all">
                      <em>No Minimum</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem value={price} key={price}>
                        ${price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="search-max-price">Max Price</InputLabel>
                  <Field
                    name="maxPrice"
                    as={Select}
                    labelId="search-max-price"
                    label="maxPrice"
                  >
                    <MenuItem value="all">
                      <em>No Maximum</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem value={price} key={price}>
                        ${price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}

export function ModelSelect({ models, make, ...props }: ModelSelectProps) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({ name: props.name });
  const { data } = useSWR<Model[]>("/api/models?make=" + make, {
    //dedupingInterval: 60000,
    onSuccess: (newValues) => {
      if (!newValues.map((a) => a.model).includes(field.value)) {
        setFieldValue("model", "all");
      }
    },
  });
  const newModels = data || models;
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="search-model">Model</InputLabel>
      <Select
        name="model"
        labelId="search-model"
        label="Model"
        {...field}
        {...props}
      >
        <MenuItem value="all">
          <em>All models</em>
        </MenuItem>
        {newModels.map(({ model, count }) => (
          <MenuItem value={model} key={model}>
            {model} ({count})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  const [makes, models] = await Promise.all([getMakes(), getModels(make)]);
  return { props: { makes, models } };
};
