// imports
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();

// db connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'employee_db'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connect as id ' + connection.threadId);
    afterConnection();
});

// welcome
afterConnection = () => {
    console.log('********************')
    console.log('*                  *')
    console.log('* EMPLOYEE MANAGER *')
    console.log('*                  *')
    console.log('********************')
    promptUser();
};

// opening prompt
const promptUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            choices: ['View all departments', 
            'View all roles', 
            'View all employees', 
            'Add a department', 
            'Add a role', 
            'Add an employee', 
            'Update an employee role',
            'Update an employee manager',
            "View employees by department",
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            'View department budgets',
            'No Action']
        }
    ])
    .then ((answers) => {
        const { choices } = answers; 

      if (choices === "View departments") {
        showDepartments();
      }

      if (choices === "View roles") {
        showRoles();
      }

      if (choices === "View employees") {
        showEmployees();
      }

      if (choices === "Add department") {
        addDepartment();
      }

      if (choices === "Add role") {
        addRole();
      }

      if (choices === "Add employee") {
        addEmployee();
      }

      if (choices === "Update employee role") {
        updateEmployee();
      }

      if (choices === "Update employee manager") {
        updateManager();
      }

      if (choices === "View employees by department") {
        employeeDepartment();
      }

      if (choices === "Delete department") {
        deleteDepartment();
      }

      if (choices === "Delete role") {
        deleteRole();
      }

      if (choices === "Delete employee") {
        deleteEmployee();
      }

      if (choices === "View department budgets") {
        viewBudget();
      }

      if (choices === "DONE") {
        connection.end()
        };
    });
};

// show dept
showDepartments = () => {
    console.log('Showing departments\n');
  const sql = `SELECT department.id AS id, department.name AS department FROM department`; 

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};
