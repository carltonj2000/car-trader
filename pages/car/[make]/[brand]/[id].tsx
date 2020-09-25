import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";

import { CarModel } from "@components/carModel";
import { openDb } from "@components/openDb";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

interface CarDetailsProps {
  car: CarModel | null;
}

export default function CarDetails({ car }: CarDetailsProps) {
  const classes = useStyles();
  const {
    id,
    make,
    model,
    year,
    fuelType,
    kilometers,
    details,
    price,
    photoUrl,
  } = car;
  console.log(photoUrl);
  if (!car) return <h1>Sorry, Car Not Found!</h1>;
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={5}>
            <img className={classes.img} alt="complex" src={photoUrl} />
          </Grid>
          <Grid item xs={12} sm={6} md={7} container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  {make} {model} {year}
                </Typography>
                <Typography variant="subtitle1">${price}</Typography>
                <Typography variant="body2" gutterBottom>
                  {kilometers} km
                </Typography>
                <Typography variant="body2">Fuel: {fuelType}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {details}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log(ctx.params);
  const { make, brand, id } = ctx.params;
  const db = await openDb();
  const car = await db.all("SELECT * FROM Car where id = ?", id);
  return { props: { car: car.length === 0 ? null : car[0] } };
};
