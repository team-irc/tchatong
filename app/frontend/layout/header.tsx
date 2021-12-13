import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Box, TextField } from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import type { streamer } from "../pages/api/streamers";
import styles from "../styles/Header.module.css";
import { useRouter, NextRouter } from "next/router";

const Header: FC = ({ children }): JSX.Element => {
  const router: NextRouter = useRouter();
  const [streamerList, setStreamerList] = useState<streamer[]>([]);
  const [textToSearch, setTextToSearch] = useState<string>("");

  const searchBarKeyDown = (e: any) => {
    console.log("keydown");
    if (e.code === "Enter" && e.target.value) {
      router.push(`/${e.target.value}`);
    }
  };

  useEffect(() => {
    try {
      fetch("http://127.0.0.1/api/streamers", { method: "GET" })
        .then((res) => res.json())
        .then((res: streamer[]) => setStreamerList(res));
      console.log(streamerList);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <>
      <header className={styles.Header}>
        <Link href={"/"}>
          <Button className={styles.Logo}>트채통</Button>
        </Link>
        <Autocomplete
          disablePortal
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            padding: "5px",
            width: "20%",
          }}
          options={streamerList}
          inputValue={textToSearch}
          onInputChange={(_, value) => setTextToSearch(value)}
          getOptionLabel={(data: streamer) => data.streamerName}
          renderOption={(props, data) => (
            <Box {...props}>
              <img
                src={data.avatarUrl}
                alt={`${data.streamerName}'s avatar`}
                className={styles.AutoCompleteAvatarImg}
              />
              {data.streamerName}
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
      </header>
      {children}
    </>
  );
};

export default Header;
