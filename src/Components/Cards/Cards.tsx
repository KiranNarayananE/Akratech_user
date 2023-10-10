import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { userDataProps } from "../../Types/types";

interface props {
  data: userDataProps;
  deleteUser: (id: string) => void;
}

const Cards: React.FC<props> = ({ data, deleteUser }) => {
  return (
    <Card sx={{ maxWidth: 300,mx: { xs: 'auto' } }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={data.image}
          alt="green iguana"
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography gutterBottom variant="h6" component="div" sx={{}}>
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary"></Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          alignItems: "end",
        }}
      >
        <Button
          onClick={() => {
            deleteUser(data.id);
          }}
          variant="outlined"
          startIcon={<DeleteIcon />}
          color="error"
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default Cards;
