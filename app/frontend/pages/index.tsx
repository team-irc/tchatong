import { Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "../styles/Home.module.css";
import useAutoComplete from "../components/hooks/useAutoComplete";

const Home = () => {
  const [autoCompleteProps, searchButtonOnClick] = useAutoComplete();

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
              }}
              onClick={searchButtonOnClick}
            />
          </Box>
        </Box>
      </main>
    </>
  );
};

export default Home;
