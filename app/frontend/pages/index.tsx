import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { Box, TextField } from "@material-ui/core";
import Autocomplete from '@mui/material/Autocomplete';
import type { streamer } from './api/streamers';
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
            options={data}
            getOptionLabel={(data: streamer) => data.streamerName}
            renderInput={(params) => {
              return (<TextField label={"스트리머 닉네임을 입력해주세요."}
                                 {...params}
                                 className={styles.SearchText}
                                 variant={"filled"} />)
            }} />
        </Box>
      </main>
      <footer></footer>
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
