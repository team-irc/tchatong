import styles from "../styles/Footer.module.css";
import { Button } from "@material-ui/core";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { FC } from "react";

const Footer: FC = ({children}): JSX.Element => {
  return (
    <>
      {children}
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

export default Footer;