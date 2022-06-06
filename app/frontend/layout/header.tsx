import { FC, HTMLAttributes } from "react";
import Link from "next/link";
import { Button, Box, createTheme, ThemeProvider, Badge } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import styles from "../styles/Header.module.css";
import useAutoComplete from "../components/hooks/useAutoComplete";
import { Streamer } from "../interfaces/streamer";
import useBadge from "../components/hooks/useBadge";
import Image from "next/image";

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
          fontSize: "2rem",
          marginLeft: "1rem",
        },
      },
    },
  },
});

const AutoCompleteList: FC<{
  props: HTMLAttributes<HTMLLIElement>,
  streamer: Streamer
}> = ({ props, streamer }) => {
  const badgeProps = useBadge(streamer.onAir, 15, 15);

  return <li {...props}>
    <Badge {...badgeProps as any}>
      <Image
        src={streamer.imageUrl}
        alt={`${streamer.nick}'s avatar`}
        width={50}
        height={50}
        className={styles.AutoCompleteAvatarImg}
      />
    </Badge>
    {streamer.nick}
    <br />
  </li>
}

const Header: FC = ({ children }): JSX.Element => {
  const [autoCompleteProps, searchButtonOnClick] = useAutoComplete(
    [],
    "",
    "small"
  );

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
              <AutoCompleteList props={props} streamer={data} />
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
