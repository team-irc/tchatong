import { FC } from "react";
import Link from "next/link";
import { Button, Box, createTheme, ThemeProvider } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import styles from "../styles/Header.module.css";
import useAutoComplete from "../components/hooks/useAutoComplete";

const theme = createTheme({
  palette: {
    primary: {
      dark: "#8958d8",
      main: "#a672f6",
      light: "#c48dff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          objectFit: "fill",
          height: "4rem",
          fontSize: "2rem",
          marginLeft: "1rem",
        },
      },
    },
  },
});

const Header: FC = ({ children }): JSX.Element => {
  const [autoCompleteProps, searchButtonOnClick] = useAutoComplete();

  return (
    <>
      <ThemeProvider theme={theme}>
        <header className={styles.Header}>
          <Link href={"/"}>
            <Button>트채통</Button>
          </Link>
          <Autocomplete
            className={styles.SearchBar}
            {...autoCompleteProps}
            renderOption={(props, data) => (
              <li {...props}>
                <img
                  src={data.image_url}
                  alt={`${data.nick}'s avatar`}
                  className={styles.AutoCompleteAvatarImg}
                />
                {data.nick}
                <br />
              </li>
            )}
          />
          <Box className={styles.SearchButtonBox}>
            <SearchIcon
              fontSize="large"
              style={{
                cursor: "pointer",
                color: "var(--background-white)",
                marginLeft: "0.2rem",
              }}
              onClick={searchButtonOnClick}
            />
          </Box>
        </header>
      </ThemeProvider>
      {children}
    </>
  );
};

export default Header;
