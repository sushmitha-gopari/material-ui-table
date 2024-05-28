// Navbar.jsx

import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import React from "react";
import "./navbar.css";
import { GridMenuIcon } from "@mui/x-data-grid";

const Navbar = () => {
  return (
    <div>
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit">
          <GridMenuIcon />
        </IconButton>
        <h3>
          MUI - Table
        </h3>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Stack direction="row" spacing={2}>
          <Link className="stack-links" to="/">Table</Link>
          <Link className="stack-links" to="/table">Datagrid Table</Link>
          <IconButton color="inherit">
            <Badge badgeContent={5} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={7} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
    </div>
  );
};

export default Navbar;
