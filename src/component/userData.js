import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

export default function UserData() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Role",
      selector: (row) => row.role,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button className="edit" onClick={() => handleEdit(row)}>
            <FaEdit />
          </button>
          <button className="delete" onClick={() => handleDelete(row)}>
            <MdDelete />
          </button>
        </>
      ),
    },
  ];

  const handleEdit = (row) => {
    const rowIndex = data.findIndex((r) => r === row);
    const newData = [...data];
    const updatedName = prompt("Enter updated name:", row.name);
    const updatedEmail = prompt("Enter updated email:", row.email);
    const updatedRole = prompt("Enter updated role:", row.role);
    newData[rowIndex] = {
      ...newData[rowIndex],
      name: updatedName,
      email: updatedEmail,
      role: updatedRole,
    };
    setData(newData);
    console.log("Edit row: ", newData[rowIndex]);
  };

  const handleDelete = (row) => {
    const newData = data.filter((r) => r !== row);
    setData(newData);
  };

  const handleSelect = React.useCallback((selectedRows) => {
    // console.log("Selected");
    setSelectedRows(selectedRows);
  }, []);

  const handleDeleteSelected = () => {
    // console.log("Deleting");
    const selectedRowsArray = Array.isArray(selectedRows) ? selectedRows : []
    const newData = data.filter((row) => !selectedRowsArray.includes(row));
    // console.log('deleted')
    setData(newData);
    const newFilteredData = filteredData.filter(
      (row) => !selectedRowsArray.includes(row),
    //   console.log('error'),
    );
    setFilteredData(newFilteredData);
    // console.log('error')

    setSelectedRows([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (searchTerm) => {
    const filteredData = data.filter(
      (row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const req = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        const res = await req.json();
        setData(res);
        setFilteredData(res);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#4CAF50",
        color: "white",
      },
    },
  };

  return (
    <React.Fragment>
      <h1>User Data</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-icon" onClick={() => handleSearch(search)}>
          Search
        </button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination
        selectableRows
        selectableRowsHighlight
        highlightOnHover
        customStyles={customStyles}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10]}
        paginationTotalRows={filteredData.length}
        onChangePage={(page) => handlePageChange(page)}
        onSelectedRowsChange={(state) => handleSelect(state.selectedRows)}
      />
      <button
        className="delete-selected"
        onClick={handleDeleteSelected}
        disabled={selectedRows.length === 0}
      >
        Delete Selected
      </button>
    </React.Fragment>
  );
}
