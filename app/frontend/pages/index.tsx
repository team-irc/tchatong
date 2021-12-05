import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { Button } from "@material-ui/core";
import { Delete } from "@mui/icons-material";

const Home: NextPage = () => {
  return (
    <div className={styles.Home}>
      <Button variant="contained" color="primary">hello world</Button>
      <Delete />
    </div>
  )
}

export default Home
