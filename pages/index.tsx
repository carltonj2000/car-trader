import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getMakes, Make } from "@components/getMakes";
import { Formik, Form, Field } from "formik";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "auto",
    maxWidth: 500,
    padding: theme.spacing(3),
  },
}));

export interface HomeProps {
  makes: Make[];
}

const prices = [500, 1000, 5000, 15000, 25000, 50000, 100000];

export default function Home({ makes }: HomeProps) {
  const classes = useStyles();
  const { query } = useRouter();

  const initialValues = {
    make: query.make || "all",
    model: query.model || "all",
    minPrice: query.minPrice || "all",
    maxPrice: query.maxPrice || "all",
  };
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                Model
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const makes = await getMakes();
  return { props: { makes } };
};
