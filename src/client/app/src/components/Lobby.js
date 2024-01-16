import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  Grid,
} from "@mui/material";

import { getAvatarSrc } from "../helpers/utils";

export default function Lobby({ joinRoom }) {
  const [formData, setFormData] = useState({
    name: "",
    avatar: "Joe",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    joinRoom(formData);
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="column"
          spacing={1}
        >
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Ready to Chat?
            </Typography>
          </Grid>
          <Grid item>
            <FormControl>
              <Select
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                required
              >
                <MenuItem value="Joe">
                  {" "}
                  <Avatar alt="Joe" src={getAvatarSrc("Joe")} />
                </MenuItem>
                <MenuItem value="Akane">
                  {" "}
                  <Avatar alt="Akane" src={getAvatarSrc("Akane")} />
                </MenuItem>
                <MenuItem value="Eliot">
                  {" "}
                  <Avatar alt="Eliot" src={getAvatarSrc("Eliot")} />
                </MenuItem>
                <MenuItem value="Zoe">
                  {" "}
                  <Avatar alt="Zoe" src={getAvatarSrc("Zoe")} />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              Ready
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
