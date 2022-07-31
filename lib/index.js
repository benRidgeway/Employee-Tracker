const mysql = require('mysql2')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_trackerDB'
    },
    console.log('connected to employee_trackerDB')
);

const depArr = () => {
    const addDepArr = [];
    db.query('SELECT * FROM department', (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            addDepArr.push({name:rows[i].name, value:rows[i].id})
        }
    });
    return addDepArr;
};

// Add new-departments to departments
const newDep = (obj) => {
    const sql = `INSERT INTO department (names) VALUES ('${obj.name}')`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        return;
    })
};

// 
const selDep = () => {
    const dep = [];
    db.query(`SELECT * FROM department`, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            dep.push(rows[i]);
        }
    });
    return dep;
};

// Filling the employee array
const addEmpArr = () => {
    const empArr = [];
    db.query(`SELECT * FROM employee ORDER BY last_name`, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            empArr.push({name:rows[i].first_name + ' ' + rows[i].last_name, value:rows[i].id});
        }
    });
    return empArr;
};

// Filling Role array
const addRoleArr = () => {
    const roleArr = [];
    db.query(`SELECT * FROM roles`, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            roleArr.push({name:rows[i].title, value:rows[i].id}) ;
        }
    });
    return roleArr;
};

// function to update the roles
const updateRole = (obj) => {
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
    const params = [obj.newRole, obj.employee]
    db.query(sql, params, (err, res) => {
        if (err) throw err;
        return;
    })
};

// Pull employees
const getEmp = () => {
    const emp = [];
    db.query(`SELECT e.id, e.first_name, e.last_name, roles.title AS job_title, roles.salary AS salary, department.names AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN roles ON role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id`, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            emp.push(rows[i]);
        }
    });
    return emp;
};

module.exports = {depArr, newDep, selDep, addEmpArr, addRoleArr, updateRole, getEmp}






