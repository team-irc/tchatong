import Image from "next/image";
import { Badge, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import BarChartIcon from '@mui/icons-material/BarChart';
import styles from "../styles/Home.module.css";
import useAutoComplete from "../components/hooks/useAutoComplete";
import useBadge from "../components/hooks/useBadge";
import { FC, HTMLAttributes } from "react";
import { Streamer } from "../interfaces/streamer";
import Link from "next/link";

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

const Home = () => {
  const [autoCompleteProps, searchButtonOnClick] = useAutoComplete(
    [],
    "",
    "medium"
  );

  return (
    <>
      <main className={styles.Home}>
        <Box className={styles.MainContentLogo}>
          <h1 className={styles.MainLogo}>트채통</h1>
          <h2 className={styles.SubLogo}> | 트위치 채팅 통계 시스템</h2>
        </Box>
        <Box className={styles.MainContent}>
          <Autocomplete
            sx={{ width: "100%" }}
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
              }}
              onClick={searchButtonOnClick}
            />
          </Box>
        </Box>
        <Link href="/statistics">
          <div className={styles.StatisticsButtonLink}>
            <BarChartIcon />
            종합 통계 보기
          </div>
        </Link>
      </main>
    </>
  );
};

export default Home;
