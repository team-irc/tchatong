import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { Box, Button, TextField } from "@material-ui/core";
import Autocomplete from '@mui/material/Autocomplete';
import type { streamer } from './api/streamers';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import styles from '../styles/Home.module.css';

const Home = ({ data }: InferGetServerSidePropsType<GetServerSideProps>) => {
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
            sx={{ width: "100%" }}
            options={data}
            getOptionLabel={(data: streamer) => data.streamerName}
            renderOption={(props, data) => (
              <Box {...props}>
                <img src={data.avatarUrl}
                     alt={`${data.streamerName}'s avatar`}
                     className={styles.AutoCompleteAvatarImg}/>
                {data.streamerName}
                <br/>
              </Box>
            )}
            renderInput={(params) => {
              return (<TextField label={"스트리머 닉네임을 입력해주세요."}
                                 {...params}
                                 variant={"filled"} />)
            }} />
        </Box>
      </main>
      <footer className={styles.Footer}>
        <Button variant={"text"}
                startIcon={<SupportAgentIcon />}
                size={"large"}
                className={styles.FooterButtonToServiceCenter}>
          고객센터
        </Button>
        <div className={styles.FooterCopyRights}>
          &copy; 2021 <a href={"https://github.com/team-irc"}>team-irc</a> all rights reserved.
        </div>
      </footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("http://localhost/api/streamers", {method: "GET"});
  const data: streamer[] = await res.json();
  if (!data) return {notFound: true}
  return {props: {data: data}};
}

export default Home
