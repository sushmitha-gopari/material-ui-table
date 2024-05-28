import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import axios from "axios";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import SearchBar from "material-ui-search-bar";

const TableComponent = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searched, setSearched] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    website: "",
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (response.data && response.data.length !== undefined) {
        setUsers(response.data);
        console.log(response, "=================");
      } else {
        console.error("Invalid data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const openConfirmationDialog = (user, actionType) => {
    setSelectedUser(user);
    setAction(actionType);
    setEditDialogOpen(true);
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    console.log("Delete user with ID:", userId);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "website", headerName: "Website", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openConfirmationDialog(params.row, "edit")}
            style={{ marginRight: 5 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => openConfirmationDialog(params.row, "delete")}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const tableData = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    website: user.website,
  }));

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };
  const closeAddDialog = () => {
    setAddDialogOpen(false);
  };
  const handleAddUser = () => {
    const newUserObj = {
      id: users.length,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      website: newUser.website,
    };

    setUsers([newUserObj, ...users]);
    setAddDialogOpen(false);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setAction(null);
    setEditDialogOpen(false);
  };

  const handleUpdate = () => {
    const updatedUsers = [...users];
    const index = updatedUsers.findIndex((user) => user.id === selectedUser.id);

    if (index !== -1) {
      // Update the user data
      updatedUsers[index] = selectedUser;

      // Set the updated users array
      setUsers(updatedUsers);

      // Close the modal
      setEditDialogOpen(false);
    } else {
      console.error("User not found for update");
    }
  };

  const handleAction = () => {
    if (action === "edit") {
      handleUpdate();
    } else if (action === "delete") {
      handleDelete(selectedUser.id);
    }
    handleCloseModal();
  };
  const requestSearch = (searchVal) => {
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchVal.toLowerCase())
    );
    setUsers(filteredUsers);
    setSearched(searchVal);
  };
  const cancelSearch = () => {
    setSearched("");
    fetchData();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={openAddDialog}
        style={{ float: "right", margin: "2%", marginRight: "8%" }}
      >
        Add
      </Button>
      <SearchBar
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
        style={{ width: "40%", margin: "2%" }}
      />
      <Box sx={{ width: "90%", margin: "2%" }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {action === "edit" ? "Edit User" : "Delete User"}
          <IconButton onClick={handleCloseModal} style={{ float: "right" }}>
            <GridCloseIcon color="primary"></GridCloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Stack spacing={2} margin={2}>
              {action === "edit" ? (
                <>
                  <TextField
                    label="Name"
                    value={selectedUser.name}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, name: e.target.value })
                    }
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: 10 }}
                  />
                  <TextField
                    label="Email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: 10 }}
                  />
                  <TextField
                    label="Username"
                    value={selectedUser.username}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        username: e.target.value,
                      })
                    }
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: 10 }}
                  />
                  <TextField
                    label="Website"
                    value={selectedUser.website}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        website: e.target.value,
                      })
                    }
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: 10 }}
                  />
                </>
              ) : (
                <DialogContentText>
                  Are you sure you want to delete{" "}
                  {selectedUser && selectedUser.name}?
                </DialogContentText>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleAction}
                style={{ marginRight: 10 }}
              >
                {action === "edit" ? "Update" : "Delete"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={addDialogOpen}
        onClose={closeAddDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          User Registeration{" "}
          <IconButton onClick={closeAddDialog} style={{ float: "right" }}>
            <GridCloseIcon color="primary"></GridCloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <TextField
              variant="outlined"
              label="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField
              variant="outlined"
              label="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <TextField
              variant="outlined"
              label="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <TextField
              variant="outlined"
              label="Website"
              value={newUser.website}
              onChange={(e) =>
                setNewUser({ ...newUser, website: e.target.value })
              }
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="primary" />}
              label="Agree terms & conditions"
            />
            <Button color="primary" variant="contained" onClick={handleAddUser}>
              Submit
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableComponent;
