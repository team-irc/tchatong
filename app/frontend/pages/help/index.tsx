import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Header from "../../layout/header";
import Faq from "../../components/pages/help/faq";
import { Streamer } from "../../interfaces/streamer";

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
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
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
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Header autoCompleteData={data}>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: "calc(100vh - 4rem)",
          marginTop: "4rem",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          TabIndicatorProps={{ style: { background: "var(--purple1)" } }}
          sx={{
            borderRight: 1,
            borderColor: "divider",
            width: "10rem",
            color: "rgba(137,88,216,0.5)",
            "& .Mui-selected": { color: "#8958d8 !important" },
          }}
        >
          <Tab label="FAQ" {...a11yProps(0)} />
          <Tab label="문의하기" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Faq />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
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
    body: JSON.stringify({ query: "{ Streamer_all { nick, image_url } }" }),
  });
  const data: Streamer[] = (await res.json()).data.Streamer_all;
  if (!data) return { notFound: true };
  return { props: { data } };
};

export default Help;
