import React, { Component } from 'react';
import './App.css';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TextField

} from "@material-ui/core";

import Button from '@material-ui/core/Button';
import * as _ from "lodash";
import FormComponent from './Form';
const axios = require('axios');


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      selectedIndex: 0,
      selectedConnections: "0",
      showForm: false,
      tag: '',
      firstName: '',
      lastName: '',
      email: '',
      dept: '',
      designation: '',
      Edit: false,
      searchShow: false,
      searchText: '',
      newEmployee: {}
    };

  }

  componentDidMount() {
    this.FetchEmployess()
  }

  //To see the employee list in table form from json-server endpoint
  FetchEmployess = () => {
    let url = "http://localhost:4000/employee";
    fetch(url)
      .then(respone => respone.json())
      .then(data => {
        this.setState({ posts: data });
      })
    this.forceUpdate();
  }

  //Open add/edit dialog form
  handleAddClick = (isEditConnection) => {
    this.setState({
      tag: '', firstName: '', lastName: '', email: '', dept: '', birthDate: '', designation: '', Edit: false
    });
    this.setState({ showForm: true })
    if (isEditConnection == true) {
      this.setState({ Edit: true })

      const employee = _.find(this.state.posts, { EmpId: this.state.selectedIndex });
      if (employee != undefined) {
        this.setState({
          tag: employee.EmpTagNumber,
          firstName: employee.FirstName,
          lastName: employee.LastName,
          email: employee.EmailAdress,
          dept: employee.Department,
          birthDate: employee.Birthdate,
          designation: employee.Designation
        })
      }
    }
  }

  //Get the age using birth date
  GetAge = (birthDate) => {
    let date = String(birthDate);
    let birthyear = date.substr(0, 4)
    let age = (2019 - parseInt(birthyear))
    return age;
  }

  //set the index of selected row for edit/delete operation
  handleRowClick = (id) => {
    const employee = _.find(this.state.posts, {
      EmpId: id
    });
    this.setState({ selectedIndex: id })

  };

  handleSelectedConnection = (selectedRow) => {
    let rowsSelected = selectedRow;
    this.setState({ selectedIndex: rowsSelected })
  }

  //delete the selected employee
  handleDeleteClick = () => {
    const url = `http://localhost:4000/employee/${this.state.selectedIndex}`;
    const employee = _.find(this.state.posts, { id: this.state.selectedIndex });
    axios.delete(url, { data: employee }).then(resp => {
      console.log(resp.data)
      let url = "http://localhost:4000/employee";
      fetch(url)
        .then(respone => respone.json())
        .then(data => {
          this.setState({ posts: data });
        })
      this.forceUpdate();
    }).catch(error => {
      console.log(error);
    });
  }

  //Edit the newly added employee details
  handleEditClick = () => {
    const employee = _.find(this.state.posts, {
      EmpId: this.state.selectedIndex
    });
    if (employee != undefined) {
      var index = employee.EmpId;
      const newEmployee = {
        EmpId: index,
        EmpTagNumber: this.state.tag,
        FirstName: this.state.firstName,
        LastName: this.state.lastName,
        EmailAdress: this.state.email,
        Department: this.state.dept,
        Birthdate: this.GetAge(this.state.age),
        Designation: this.state.designation
      }
    }
  }

  //Add the employee using put method
  handleAddEmployeeClick = () => {
    axios.post('http://localhost:4000/Employee', {
      "id": (this.state.posts[this.state.posts.length - 1].id + 1),
      "EmpId": (this.state.posts[this.state.posts.length - 1].id + 1),
      "EmpTagNumber": this.state.tag,
      "FirstName": this.state.firstName,
      "LastName": this.state.lastName,
      "EmailAdress": this.state.email,
      "Department": this.state.dept,
      "Birthdate": this.state.Birthdate,
      "Designation": this.state.designation
    }).then(resp => {
      this.state.posts.push(resp.data);
      this.setState({ showForm: false });
      console.log(resp.data);
    }).catch(error => {
      console.log(error);
    });
  }

  //Edit the employee using put request
  handleEditEmployee = () => {
    const url = `http://localhost:4000/employee/${this.state.selectedIndex}`;
    axios.put(url, {
      "EmpId": this.state.selectedIndex,
      "EmpTagNumber": this.state.tag,
      "FirstName": this.state.firstName,
      "LastName": this.state.lastName,
      "EmailAdress": this.state.email,
      "Department": this.state.dept,
      "Birthdate": this.state.birthDate,
      "Designation": this.state.designation
    }).then(resp => {
      console.log(resp.data);
      this.state.posts[this.state.selectedIndex - 1] = resp.data;
      let url = "http://localhost:4000/employee";
      fetch(url)
        .then(respone => respone.json())
        .then(data => {
          this.setState({ posts: data });
        })
      this.forceUpdate();
    }).catch(error => {
      console.log(error);
    });
    this.setState({ Edit: false, showForm: false });
    //clear the state data that we used to show employee details edit in dialog
    this.setState({
      tag: '', firstName: '', lastName: '', email: '', dept: '', birthDate: '', designation: ''
    });
  }

  //sort the data for given parameter
  sortData = () => {
    axios.get('http://localhost:4000/employee?_sort=FirstName&_order=asc')
      .then(resp => {
        console.log(resp.data);
      }).catch(error => {
        console.log(error);
      });
    this.FetchEmployess();
  }

  //Take sort action for given column
  onSort = (event, sortKey) => {
    const data = this.state.posts;
    data.sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
    this.setState({ posts: data })
  }

  //Form inputs changes, to set the state for respective fields
  emailChangeHandler = (event) => {
    this.setState({ email: event.target.value })
  }

  tagChangeHandler = (event) => {
    this.setState({ tag: event.target.value })
  }

  fNameChangeHandler = (event) => {
    this.setState({ firstName: event.target.value })
  }

  lNameChangeHandler = (event) => {
    this.setState({ lastName: event.target.value })
  }

  deptChangeHandler = (event) => {
    this.setState({ dept: event.target.value })
  }

  ageChangeHandler = (event) => {
    this.setState({ birthDate: event.target.value })
  }

  desChangeHandler = (event) => {
    this.setState({ designation: event.target.value })
  }

  handleCloseForm = () => {
    this.setState({ showForm: false })
  }

  searchHandler = (event) => {
    this.setState({ searchText: event.target.value })
  }

  getSelectedEmployee = () => {
    const employee = _.find(this.state.posts, {
      EmpId: this.state.selectedIndex
    });
    if (employee !== undefined) {
      return employee.FirstName;
    }
    return "None";
  }

  //Search the data for given value using json-server api call
  searchData = () => {
    let textToSearch = this.state.searchText;
    axios.get(`http://localhost:4000/employee?q=${this.state.searchText}`)
      .then(resp => {
        var newEmployee = resp.data[0];
        this.setState({ newEmployee });
        console.log(resp.data)
        this.setState({ searchShow: true })
      }).catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <div style={{ fontSize: "30px", margin: "10px", textAlign: "center" }}>
          Contrado Employee Management System
        </div>
        <div style={{ height: "40px", span: "5px", width: "80%", margin: 'auto', marginBottom: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ display: "inline-block", marginTop: "10px", marginLeft: "28px" }}
            onClick={() => this.handleAddClick(false)}
          >
            Add Employee
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{ width: "155px", display: "inline-block", marginTop: "10px", marginLeft: "28px" }}
            onClick={() => this.handleAddClick(true)}
          >
            Edit Employee
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ display: "inline-block", marginTop: "10px", marginLeft: "28px" }}
            onClick={() => this.handleDeleteClick()}
          >
            <span style={{ cursor: "pointer" }}>
              Delete Employee
          </span>
          </Button>
          {this.state.selectedIndex > 0 &&
            <span style={{ marginLeft: "15px", fontSize: "20px", marginTop: "5px", float: "right" }}>Selected Employee = {this.getSelectedEmployee()}</span>}
        </div>
        <div>
          <Table
            id="tblConnectionList"
            onRowSelection={this.handleSelectedConnection}
            style={{ width: "80%", margin: 'auto', maxHeight: "20vh" }}

          >
            <TableHead displaySelectAll={false}>
              <TableRow>
                <TableCell
                  id={`thcName`}
                  className="tableHeaderManageConnection"
                  onClick={e => this.onSort(e, 'EmpTagNumber')}>
                  Emp tag Number  <span style={{ fontSize: "18px", cursor: "pointer" }}> &#11014;</span>
                </TableCell>
                <TableCell
                  onClick={e => this.onSort(e, 'FirstName')}
                  id={`thcName`}
                  className="tableHeaderManageConnection">
                  First Name <span style={{ fontSize: "18px", cursor: "pointer" }}> &#11014;</span>
                </TableCell>
                <TableCell
                  id={`thcName`}
                  className="tableHeaderManageConnection"
                  onClick={e => this.onSort(e, 'LastName')}>
                  Last Name <span style={{ fontSize: "18px", cursor: "pointer" }}> &#11014;</span>
                </TableCell>
                <TableCell
                  id={`thcName`}
                  className="tableHeaderManageConnection">
                  Email
                </TableCell>
                <TableCell
                  id={`thcName`}
                  className="tableHeaderManageConnection">
                  Department
                </TableCell>
                <TableCell
                  id={`thcName`}
                  className="tableHeaderManageConnection">
                  Age
                </TableCell>
                <TableCell
                  id={`thcName`}
                  className="tableHeaderManageConnection">
                  Designation
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody
              deselectOnClickaway={false}
              showRowHover={true}
              displayRowCheckbox={true}>
              {this.state.posts.map((row, index) => (
                <TableRow
                  key={index}
                  id={`trc${row.id}`}
                  hover
                  onClick={event => this.handleRowClick(row.EmpId)}
                  selected={index === this.state.selectedIndex}
                >
                  <TableCell
                    id={`trc${row.id}`}>
                    {row.EmpTagNumber}
                  </TableCell>
                  <TableCell
                    id={`trc${row.name}`}>
                    {row.FirstName}
                  </TableCell>
                  <TableCell
                    id={`trc${row.LastName}`}>
                    {row.LastName}
                  </TableCell>
                  <TableCell
                    id={`trc${row.EmailAdress}`}>
                    {row.EmailAdress}
                  </TableCell>
                  <TableCell
                    id={`trc${row.Department}`}>
                    {row.Department}
                  </TableCell>
                  <TableCell
                    id={`trc${row.id}`}>
                    {this.GetAge(row.Birthdate)}
                  </TableCell>
                  <TableCell
                    id={`trc${row.Designation}`}>
                    {row.Designation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div style={{ marginTop: "3%" }}>
          <TextField autoFocus margin="dense"
            id="name"
            label="Enter Text to Search:"
            type="text"
            onChange={(event) => this.searchHandler(event)}
            style={{ marginLeft: "10%" }}></TextField>

          <Button
            variant="outlined"
            style={{ width: "155px", display: "inline-block", marginTop: "10px", marginLeft: "28px" }}
            onClick={() => this.searchData()}
          >
            Search
          </Button>

          {this.state.searchShow && this.state.newEmployee !== undefined &&
            <div style={{ marginLeft: "10%", marginTop: "2%" }}>
              <span style={{ fontSize: "25px" }}> Employee details:</span><br />
              <br />Employee Tag Number: {this.state.newEmployee.EmpTagNumber}
              <br />Name: {this.state.newEmployee.FirstName} {" "} {this.state.newEmployee.LastName}
              <br />Email Adress: {this.state.newEmployee.EmailAdress}
              <br />Dsignation: {this.state.newEmployee.Designation}
              <br />Department: {this.state.newEmployee.Department}
            </div>}

          {this.state.searchShow && this.state.newEmployee == undefined &&
           <div style={{ marginLeft: "10%", marginTop: "2%" }}>
           <span style={{ fontSize: "25px" }}> 
            No Employee Found</span> </div>}

        </div>

        <FormComponent
          Employees={this.state.posts}
          emailChangeHandler={this.emailChangeHandler}
          fNameChangeHandler={this.fNameChangeHandler}
          lNameChangeHandler={this.lNameChangeHandler}
          deptChangeHandler={this.deptChangeHandler}
          ageChangeHandler={this.ageChangeHandler}
          tagChangeHandler={this.tagChangeHandler}
          handleAddEmployeeClick={this.handleAddEmployeeClick}
          desChangeHandler={this.desChangeHandler}
          handleEditClick={this.handleEditClick}
          handleEditEmployee={this.handleEditEmployee}
          Edit={this.state.Edit}
          EmpTagNumber={this.state.tag}
          FirstName={this.state.firstName}
          LastName={this.state.lastName}
          EmailAdress={this.state.email}
          Department={this.state.dept}
          Birthdate={this.state.birthDate}
          Designation={this.state.designation}
          showForm={this.state.showForm}
          handleCloseForm={this.handleCloseForm}
        />
      </div>
    );
  };
}

export default App;
