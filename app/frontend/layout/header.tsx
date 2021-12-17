import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Box, TextField } from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import type { Streamer } from "../interfaces/streamer";
import styles from "../styles/Header.module.css";
import { useRouter, NextRouter } from "next/router";

const Header: FC = ({ children }): JSX.Element => {
  const router: NextRouter = useRouter();
  const [autoCompleteData, setAutoCompleteData] = useState<Streamer[]>([]);
  const [textToSearch, setTextToSearch] = useState<string>("");

  const searchButtonOnClick = () => {
    router.push(`/${textToSearch}`);
  };

  const searchBarKeyDown = (e: any) => {
    console.log("keydown");
    if (e.code === "Enter" && e.target.value) {
      router.push(`/${e.target.value}`);
    }
  };

  const fetchAutoCompleteData = async (): Promise<Streamer[]> => {
    const res: Response = await fetch("http://127.0.0.1:3000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: "{ Streamer_getAll { nick, image_url } }",
      }),
    });
    const data: Streamer[] = (await res.json()).data.Streamer_getAll;
    return data;
  };

  useEffect(() => {
    fetchAutoCompleteData().then((data) => setAutoCompleteData(data));
  }, []);

  return (
    <>
      <header className={styles.Header}>
        <Link href={"/"}>
          <Button className={styles.Logo}>트채통</Button>
        </Link>
        <Autocomplete
          disablePortal
          freeSolo
          className={styles.SearchBar}
          options={autoCompleteData}
          inputValue={textToSearch}
          onInputChange={(_, value) => setTextToSearch(value)}
          getOptionLabel={(data: Streamer) => data.nick}
          renderOption={(props, data) => (
            <Box {...props}>
              <img
                src={data.image_url}
                alt={`${data.nick}'s avatar`}
                className={styles.AutoCompleteAvatarImg}
              />
              {data.nick}
              <br />
            </Box>
          )}
          renderInput={(params) => {
            return (
              <TextField
                label={"검색하기"}
                {...params}
                variant={"filled"}
                onKeyDown={searchBarKeyDown}
              />
            );
          }}
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
