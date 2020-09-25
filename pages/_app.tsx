import { Box, Container, CssBaseline } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import App from "next/app";
import Head from "next/head";
import React from "react";
import { SWRConfig } from "swr";
import { Nav } from "@components/nav";

const baseURL = "http://localhost:4001";

// Create a theme instance.
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});

export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Car Trader</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Nav />
          <SWRConfig
            value={{
              fetcher: (url: string) => fetch(url).then((r) => r.json()),
            }}
          >
            <Container maxWidth={false}>
              <Box marginTop={2}>
                <Component {...pageProps} />
              </Box>
            </Container>
          </SWRConfig>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
