import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { NextRouter, useRouter } from "next/router";
import { Box, TextField } from "@material-ui/core";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import type { Streamer } from "../interfaces/streamer";
import styles from "../styles/Home.module.css";

const Home = ({ data }: InferGetServerSidePropsType<GetServerSideProps>) => {
  const router: NextRouter = useRouter();
  const [textToSearch, setTextToSearch] = useState<string>("");

  const searchButtonOnClick = () => {
    router.push(`/${textToSearch}`);
  };

  const searchBarKeyDown = (e: any) => {
    if (e.code === "Enter" && e.target.value) {
      router.push(`/${e.target.value}`);
    }
  };

  return (
    <>
      <main className={styles.Home}>
        <Box className={styles.MainContentLogo}>
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
                  label={"스트리머 닉네임을 입력해주세요."}
                  {...params}
                  onKeyDown={searchBarKeyDown}
                  variant={"filled"}
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
              }}
              onClick={searchButtonOnClick}
            />
          </Box>
        </Box>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res: Response = await fetch("http://backend:3000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: "{ Streamer_getAll { nick, image_url } }" }),
  });
  const data: Streamer[] = (await res.json()).data.Streamer_getAll;
  if (!data) return { notFound: true };
  return { props: { data } };
};

export default Home;
