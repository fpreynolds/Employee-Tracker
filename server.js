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

// show roles
showRoles = () => {
    console.log('Showing roles\n');
    const sql = `SELECT role.id, role.title, department.name AS department
                 FROM role
                 INNER JOIN department ON role.department_id = department.id`;   
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      promptUser();
    })
  };

// show employees
showEmployees = () => {
    console.log('Showing employees\n'); 
  const sql = `SELECT employee.id, 
                      employee.first_name, 
                      employee.last_name, 
                      role.title, 
                      department.name AS department,
                      role.salary, 
                      CONCAT (manager.first_name, " ", manager.last_name) AS manager
               FROM employee
                      LEFT JOIN role ON employee.role_id = role.id
                      LEFT JOIN department ON role.department_id = department.id
                      LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    promptUser();
  });
};

// add a dept
addDepartment = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'addDept',
        message: 'What department do you want to add?',
        validate: addDept => {
          if (addDept) {
              return true;
          } else {
              console.log('Please enter a department');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        connection.query(sql, answer.addDept, (err, result) => {
          if (err) throw err;
          console.log("Added " + answer.addDept + " to departments"); 
  
          showDepartments();
      });
    });
  };

// add role
addRole = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'role',
        message: "Enter name of role to add.",
        validate: addRole => {
          if (addRole) {
              return true;
          } else {
              console.log('Please enter a role');
              return false;
          }
        }
      },
      {
        type: 'input', 
        name: 'salary',
        message: "Enter role salary.",
        validate: addSalary => {
          if (isNAN(addSalary)) {
              return true;
          } else {
              console.log('Please enter a salary');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const params = [answer.role, answer.salary];
  
        // select dept from dept table
        const roleSql = `SELECT name, id FROM department`; 
  
        connection.promise().query(roleSql, (err, data) => {
          if (err) throw err; 
      
          const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
          inquirer.prompt([
          {
            type: 'list', 
            name: 'dept',
            message: 'Which department is this role in?',
            choices: dept
          }
          ])
            .then(deptChoice => {
              const dept = deptChoice.dept;
              params.push(dept);
  
              const sql = `INSERT INTO role (title, salary, department_id)
                          VALUES (?, ?, ?)`;
  
              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added' + answer.role + ' to roles'); 
  
                showRoles();
         });
       });
     });
   });
  };
  
// func to add employee