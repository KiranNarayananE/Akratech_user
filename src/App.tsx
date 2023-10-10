import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshIcon from "@mui/icons-material/Refresh";
import Navbar from "./Components/Navbar/Navbar";
import { Grid } from "@mui/material";
import axios from "axios";
import Dexie from "dexie";
import Cards from "./Components/Cards/Cards";
import { userDataProps } from "./Types/types";

function App(): React.FC {
  const db: Dexie = new Dexie("myLocalDatabase");
  db.version(1).stores({ user: "id,name,image" });

  const [data, setData] = useState<userDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(true);

  async function getData(): Promise<void> {
    try {
      let userTable: Dexie.Table<userDataProps> = db.table("user");
      let userDetails: userDataProps[] = await userTable.toArray();

      if (userDetails.length === 0 && loading) {
        let response = await axios.get("https://randomuser.me/api/?results=50");
        if (response) {
          let result: userDataProps[] = response.data.results
            .filter((item: {}) => item.name && item.picture)
            .map((item: {}) => ({
              name: `${item.name.first} ${item.name.last}`,
              image: item.picture.large,
              id: item.login.uuid,
            }));

          db.table("user").bulkPut(result);
          userTable = db.table("user");
          userDetails = await userTable.toArray();
        }
      }
      setData(userDetails);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (reload) {
      getData();
      setReload(false);
    }
  }, [data]);

  const deleteUser = (id: string) => {
    db.table("user")
      .where("id")
      .equals(id)
      .delete()
      .then(() => {
        setData((prevData) => prevData.filter((user) => user.id !== id));
        setReload(true);
      });
  };

  const refreshDetails = async (): Promise<void> => {
    await db.table("user").clear();
    setData([]);
    setLoading(true);
    setReload(true);
  };

  return (
    <>
      <CssBaseline />
      <Navbar />
      <main>
        <Container sx={{ padding: [8, 0, 6] }}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              User Cards
            </Typography>
          </Container>
        </Container>
        <Container sx={{ paddingTop: 8, paddingBottom: 8 }} maxWidth="md">
          {loading ? (
            <Container
              sx={{
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Container>
          ) : (
            <Grid container spacing={4}>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography variant="h5" gutterBottom>
                  Total: {data.length}
                </Typography>
                <Button
                  onClick={refreshDetails}
                  variant="contained"
                  component="label"
                  startIcon={<RefreshIcon />}
                >
                  Refresh
                </Button>
              </Grid>
              {data.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4}>
                  <Cards data={item} deleteUser={deleteUser} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </main>
    </>
  );
}

export default App;
