import styles from "../styles/Footer.module.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { FC } from "react";
import useWindowSize from "../components/hooks/useWindowSize";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: " #fffffb",
          position: "absolute",
          height: "5rem",
        },
      },
    },
  },
});

const Footer: FC = ({ children }): JSX.Element => {
  const windowSize = useWindowSize();

  return (
    <>
      {children}
      <ThemeProvider theme={theme}>
        <footer className={styles.Footer}>
          <div className={styles.FooterCopyRights}>
            &copy; 2021 <a href="https://github.com/team-irc">team-irc</a>
            {windowSize.width > 480 && <> all rights reserved.</>}
          </div>
        </footer>
      </ThemeProvider>
    </>
  );
};

export default Footer;
