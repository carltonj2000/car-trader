import React from "react";
import Link from "next/link";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { red } from "@material-ui/core/colors";

import { CarModel } from "./carModel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    avatar: {
      backgroundColor: red[500],
    },
    anchorTag: {
      textDecoration: "none",
    },
  })
);

export interface CarCardProps {
  car: CarModel;
}

export function CarCard({ car }: CarCardProps) {
  const classes = useStyles();
  const { make, model, id } = car;
  return (
    <Link href="/car/[make]/[model]/[id]" as={`/car/${make}/${model}/${id}`}>
      <a className={classes.anchorTag}>
        <Card elevation={5}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                R
              </Avatar>
            }
            title={`${car.make} ${car.model}`}
            subheader={`$${car.price} ${car.kilometers} km`}
          />
          <CardMedia
            className={classes.media}
            image={car.photoUrl}
            title={`${car.make} ${car.model}`}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {car.details}
            </Typography>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
