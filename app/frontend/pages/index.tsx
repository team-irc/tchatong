import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { NextRouter, useRouter } from "next/router";
import { Box, TextField } from "@material-ui/core";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import type { streamer } from "./api/streamers";
import styles from "../styles/Home.module.css";

const Home = ({ data }: InferGetServerSidePropsType<GetServerSideProps>) => {
  const router: NextRouter = useRouter();
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

  return (
    <>
      <main className={styles.Home}>
        <Box className={styles.MainContent}>
          <h1 className={styles.MainLogo}>트채통</h1>
          <h2 className={styles.SubLogo}> | 트위치 채팅 통계 시스템</h2>
        </Box>
        <Box className={styles.MainContent}>
          <Autocomplete
            disablePortal
            freeSolo
            sx={{ width: "100%" }}
            options={data}
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
                  label={"스트리머 닉네임을 입력해주세요."}
                  {...params}
                  onKeyDown={searchBarKeyDown}
                  variant={"filled"}
                />
              );
            }}
          />
          <SearchIcon
            fontSize="large"
            style={{
              cursor: "pointer",
              transform: "scale(1.5)",
              marginLeft: "1rem",
            }}
            onClick={searchButtonOnClick}
          />
        </Box>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("http://localhost/api/streamers", { method: "GET" });
  const data: streamer[] = await res.json();
  if (!data) return { notFound: true };
  return { props: { data: data } };
};

export default Home;
