import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { Button } from "@material-ui/core";

const Home: NextPage = () => {
  return (
    <div className={styles.Home}>
      <Button variant="contained" color="primary">hello world</Button>
    </div>
  )
}

export default Home
