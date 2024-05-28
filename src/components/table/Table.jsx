import React, { useState, useEffect } from "react";
import axios from "axios";
import "./table.css";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { GridCloseIcon, GridToolbar } from "@mui/x-data-grid";
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
    city: "",
    website: ""
  });

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };
  
  const closeAddDialog = () => {
    setAddDialogOpen(false);
  };

  const openConfirmationDialog = (user, actionType) => {
    setSelectedUser(user);
    setAction(actionType);
    setEditDialogOpen(true);
  };
  const closeEditDialog = () => {
    setEditDialogOpen(false);
  };
  
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
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setAction(null);
    setEditDialogOpen(false);
  };

  const handleAction = () => {
    if (action === "edit") {
      handleUpdate();
    } else if (action === "delete") {
      handleDelete(selectedUser.id);
    }
    handleCloseModal();
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

  const handleCancel = () => {
    setEditDialogOpen(false);
  };
  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    console.log("Delete user with ID:", userId);
  };

  const handleAddUser = () => {
    const newUserObj = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      address: { city: newUser.city },
      website: newUser.website
    };
  
    setUsers([newUserObj, ...users]);
    setAddDialogOpen(false);
  };
  

  return (
    <>
      <div className="table">
        <Button
          variant="contained"
          color="primary"
          onClick={openAddDialog}
          style={{ float: "right", marginRight: "8%" }}
        >
          Add
        </Button>
        <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
          style={{ width: "40%", margin: "2%" }}
        />
        <Paper sx={{ width: "90%", marginLeft: "2%", marginRight: "5%" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.address ? user.address.city : "N/A"}
                      </TableCell>
                      <TableCell>{user.website}</TableCell>
                      <TableCell>
                        {/* Edit Button */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => openConfirmationDialog(user, 'edit')}
                          style={{ marginRight: 5 }}
                        >
                          Edit
                        </Button>
                        {/* Delete Button */}
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => openConfirmationDialog(user, 'delete')}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            colSpan={5}
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: { "aria-label": "rows per page" },
              native: true,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            slots={{ toolbar: GridToolbar }}
          />
        </Paper>
      </div>
      {/* <Dialog open={editDialogOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
      <DialogTitle>
          Edit Registeration{" "}
          <IconButton onClick={closeEditDialog} style={{ float: "right" }}>
            <GridCloseIcon color="primary"></GridCloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Stack spacing={2} margin={2}>
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
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                variant="outlined"
                fullWidth
                style={{ marginBottom: 10 }}
              />
              <TextField
                label="City"
                value={selectedUser.address ? selectedUser.address.city : "N/A"}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    address: { ...selectedUser.address, city: e.target.value },
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
                  setSelectedUser({ ...selectedUser, website: e.target.value })
                }
                variant="outlined"
                fullWidth
                style={{ marginBottom: 10 }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                style={{ marginRight: 10 }}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Stack>
          )}
       </DialogContent>
      </Dialog> */}
      <Dialog open={editDialogOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
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
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
              variant="outlined"
              fullWidth
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="City"
              value={selectedUser.address ? selectedUser.address.city : "N/A"}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  address: { ...selectedUser.address, city: e.target.value },
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
                setSelectedUser({ ...selectedUser, website: e.target.value })
              }
              variant="outlined"
              fullWidth
              style={{ marginBottom: 10 }}
            />
          </>
        ) : (
          <DialogContentText>
            Are you sure you want to delete {selectedUser && selectedUser.name}?
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
      <Dialog open={addDialogOpen} onClose={closeAddDialog} fullWidth maxWidth="sm">
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
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField 
              variant="outlined" 
              label="City"
              value={newUser.city}
              onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
            />
            <TextField 
              variant="outlined" 
              label="Website"
              value={newUser.website}
              onChange={(e) => setNewUser({ ...newUser, website: e.target.value })}
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="primary" />}
              label="Agree terms & conditions"
            />
            <Button 
              color="primary" 
              variant="contained"
              onClick={handleAddUser}
            >
              Submit
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableComponent;