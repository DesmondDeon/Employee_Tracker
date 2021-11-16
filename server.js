const express = require('express');
const inquirer = require('inquirer');
const AccessTable = require('console.table');
const db = require('./config/connection')

// Question Arrays
const BeginHCM = [
  {
    type: 'list',
    name: 'BeginHCM',
    message: 'What would you like to do?',
    choices: [
      "add an employee role",
      "view all roles",
      "view all departments",
      "add a department",
      "view all employees",
      "add an employee",
      "update an employee's role"
    ]
  }
]

const addingaRole = [
  {
    type: 'input',
    name: 'title',
    message: 'Which role is the employee going into'
  },
  {
    type: 'input',
    name: 'department',
    message: 'What is the department number of the role'
  }
]

const addingaDepartment = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the name of the new department?'
  },
]


const addingaEmployee = [
  {
    type: 'input',
    name: 'first_name',
    message: 'What is the employee firstname'
  },
  {
    type: 'input',
    name: 'last_name',
    message: 'What is the employee last name'
  },
  {
    type: 'input',
    name: 'role_id',
    message: 'What id represent the role of the employee',
  },
  {
    type: 'input',
    name: 'manager_id',
    message: 'Please assign Reports TO: Manager IDs for employee'
  }
]

const searchforEmployee = [
  {
    type: 'input',
    name: 'employee_id',
    message: 'What is the ID of the employee you wish to update'
  },
]

const updateEmployeeRecord = [
  {
    type: 'input',
    name: 'role_id',
    message: 'Please select an ID that represents the employee role'
  },
]


// Wait for the Promise to Fill and Return a Result.  
const addRole = async() => {
  const result = await inquirer.prompt(addingaRole)
  const sql = `INSERT INTO role (title, salary, department_id)
  VALUES (?,?,?)`;
  const params = [result.title, result.salary, result.department];

  db.query(sql, params, function (err, results) {
    console.log("");
    console.table(results);
    startHCM();
  });
}

const addDepartment = async() => {
  const result = await inquirer.prompt(addingaDepartment)
  const sql = `INSERT INTO department (name)
  VALUES (?)`;
  const params = [result.name];

  db.query(sql, params, function (err, results) {
    console.log("");
    console.table(results);
    startHCM();
  });
}

const addEmployee = async() => {
  const result = await inquirer.prompt(addingaEmployee)
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (?,?,?,?)`;
  const params = [result.first_name, result.last_name, result.role_id, result.manager_id];

  db.query(sql, params, function (err, results) {
    console.log("");
    console.table(results);
    startHCM();
  });
}

const chooseEmployee = async() => {
  const result = await inquirer.prompt(searchforEmployee);

  db.query('SELECT role.id, role.title FROM role', function (err, results) {
          console.log("");
          console.table(results);
        });
  
  updateEmployeeRole(result.employee_id);
}

const updateEmployeeRole = async(employeeID) => {
  const result = await inquirer.prompt(updateEmployeeRecord)
  const sql = `UPDATE employee SET role_id = ${result.role_id}
  WHERE id = ${employeeID}`;

  db.query(sql, function (err, results) {
    console.log("");
    console.table(results);
    startHCM();
  });
}


// startMenu function acts as switchboard for options to manipulate database
const startHCM = async() => {
  const result = await inquirer.prompt(BeginHCM)
  .then(function(result) {
    switch (result.BeginHCM) {
      case "view all roles":
        db.query('SELECT role.id, role.title, role.salary, department.name AS department_name FROM role LEFT JOIN department ON role.department_id = department.id', function (err, results) {
          console.log("");
          console.table(results);
          startHCM();
        });
        break;
      
      case "add an employee role":
        db.query('SELECT * FROM department', function (err, results) {
          console.log("");
          console.table(results);
          addRole();
        });
        break;

      case "view all departments":
        db.query('SELECT * FROM department', function (err, results) {
          console.log("Your New department has been added");
          console.table(results);
          startHCM();
        });
        break;

      case "add a department":
        addDepartment();
        break;

      case "view all employees":
        db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function (err, results) {
          console.log("");
          console.table(results);
          startHCM();
        });
        break;

      case "add an employee":
        db.query('SELECT role.*, department.name AS department_name FROM role LEFT JOIN department ON role.department_id = department.id', function (err, results) {
          console.log("");
          console.table(results);
        });
        db.query('SELECT employee.*, role.title AS role_title FROM employee LEFT JOIN role ON employee.role_id = role.id', function (err, results) {
          console.log("");
          console.table(results);
          addEmployee();
        });
        break;

      case "update an employee's role":
        db.query('SELECT employee.id, employee.first_name, employee.last_name FROM employee', function (err, results) {
          console.log("");
          console.log('Employee role updated');
          chooseEmployee();
        });
        break;
    }
  });
}

// startApp function 
const welcomeMenu = async() => {
  console.log('Welcome to HCM Login Screen!');

  startHCM();
}

  

// calls startApp function to begin app
welcomeMenu();