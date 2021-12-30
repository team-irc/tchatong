import { useState, SyntheticEvent, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Header from "../../layout/header";
import Faq from "../../components/pages/help/faq";
import { Streamer } from "../../interfaces/streamer";
import ContactUs from "../../components/pages/help/contactus";
import styles from "../../styles/Help.module.css";
import useWindowSize from "../../components/hooks/useWindowSize";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && (
        <Box sx={{ height: "100%" }} className={styles.TabPannel}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Help: NextPage = ({
  data,
}: InferGetServerSidePropsType<GetServerSideProps>) => {
  const [value, setValue] = useState(0);
  const [tabsOrientation, setTabsOrientation] = useState<
    "vertical" | "horizontal"
  >("vertical");
  const windowSize = useWindowSize();

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (tabsOrientation === "vertical" && windowSize.width <= 480) {
      setTabsOrientation("horizontal");
    } else if (tabsOrientation === "horizontal" && windowSize.width > 480) {
      setTabsOrientation("vertical");
    }
  }, [windowSize, tabsOrientation]);

  return (
    <Header>
      <Box className={styles.TabBox}>
        <Tabs
          orientation={tabsOrientation}
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={styles.Tabs}
        >
          <Tab label="FAQ" {...a11yProps(0)} className={styles.Tab} />
          <Tab label="문의하기" {...a11yProps(1)} className={styles.Tab} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Faq />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ContactUs />
        </TabPanel>
      </Box>
    </Header>
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

export default Help;
