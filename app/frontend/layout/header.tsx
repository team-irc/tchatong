import { FC } from "react";
import Link from "next/link";
import { Button, Box } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import styles from "../styles/Header.module.css";
import useAutoComplete from "../components/hooks/useAutoComplete";

const Header: FC = ({ children }): JSX.Element => {
  const [autoCompleteProps, searchButtonOnClick] = useAutoComplete();

  return (
    <>
      <header className={styles.Header}>
        <Link href={"/"}>
          <Button className={styles.Logo}>트채통</Button>
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
      {children}
    </>
  );
};

export default Header;
