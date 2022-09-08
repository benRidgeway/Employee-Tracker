const promiseDb = require('../db/connection');

class SQLFunctions {

//-----------DEPARTMENTS--------------------------------------------------------------

//returns all departments, use [0] on the result to get the array
async getDepartments() {
    const db = await promiseDb;
    const sql = `SELECT department.id AS department_id, department.name AS department FROM department`;
    const result = await db.query(sql);
    return result[0];
}

//returns a single department with the given id, use [0][0] on the result to get the individual department obj
async getDepartmentById(id) {
    const db = await promiseDb;
    const sql = `SELECT * FROM department WHERE id = ?`;
    const result = await db.query(sql, id);
    return result[0][0];
}

//adds a department, use [0] on result to get the response object
async newDepartment(name) {
    const db = await promiseDb;
    const sql = `INSERT INTO department (name) VALUES (?)`
    const result = await db.query(sql, name);
    return result[0];
}

//get budget of department (combined total of all employee salaries)
async getBudget(department_id) {
    const db = await promiseDb;
    const sql = `SELECT department.id AS 'Department ID', department.name AS 'Department', SUM(role.salary) AS 'Budget' FROM department
    RIGHT JOIN role ON department.id = role.department_id
    RIGHT JOIN employee ON role.id = employee.role_id
    WHERE department_id = ?`
    const result = await db.query(sql, department_id);
    return result[0];
}

//delete department by id
async deleteDepartment(id) {
    const db = await promiseDb;
    const sql = `DELETE FROM department WHERE id = ?`
    const result = await db.query(sql, id);
    return result[0];
}



//-----------ROLES--------------------------------------------------------------

//returns all roles, use [0] on the result to get the array
async getRoles() {
    const db = await promiseDb;
    const sql = `SELECT role.id AS role_id,
    role.title,
    role.salary,
    department.name AS department_name FROM role
    LEFT JOIN department
    ON role.department_id = department.id`;
    const result = await db.query(sql);
    return result[0];
}

//returns a single role with the given id, use [0][0] on the result to get the individual department obj
async getRoleById(id) {
    const db = await promiseDb;
    const sql = `SELECT * FROM role WHERE id = ?`;
    const result = await db.query(sql, id);
    return result[0][0];
}

//creates new role
async newRole(title, salary, department_id) {
    const db = await promiseDb;
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`
    const result = await db.query(sql, [title, salary, department_id]);
    return result[0];
}

//delete row by id
async deleteRole(id) {
    const db = await promiseDb;
    const sql = `DELETE FROM role WHERE id = ?`
    const result = await db.query(sql, id);
    return result[0];
}

//-----------EMPLOYEES--------------------------------------------------------------

//returns all employees, use [0] on the result to get the array
async getEmployees() {
    const db = await promiseDb;
    const sql = `SELECT e.id AS employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employee,
    role.title AS title,
    department.name AS department,
    IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'Top Manager') AS manager,
    e.created_at FROM employee e
    LEFT JOIN role
    ON e.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee m ON
    m.id = e.manager_id`;
    const result = await db.query(sql);
    return result[0];
}

//returns array of Managers who have at least 1 direct report
async getManagers() {
    const db = await promiseDb;
    const sql = `SELECT e1.id AS id, CONCAT(e1.first_name, ' ', e1.last_name) AS 'manager' FROM employee AS e1
    JOIN (SELECT manager_id FROM employee
            GROUP BY manager_id) AS e2
        ON e1.id = e2.manager_id`
    const result = await db.query(sql);
    return result[0];
}

//returns a single employee with the given id, use [0][0] on the result to get the individual department obj
async getEmployeeById(id) {
    const db = await promiseDb;
    const sql = `SELECT * FROM employee WHERE id = ?`;
    const result = await db.query(sql, id);
    return result[0][0];
}

//creates new employee
async newEmployee(first_name, last_name, role_id, manager_id) {
    const db = await promiseDb;
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
    const result = await db.query(sql, [first_name, last_name, role_id, manager_id]);
    return result[0];
}

//update employee role
async updateRole(role_id, id) {
    const db = await promiseDb;
    const sql = `UPDATE employee
    SET role_id = ?
    WHERE id = ?`;
    const result = await db.query(sql, [role_id, id]);
    return result[0];
}

//update employee manager
async updateManager(manager_id, id) {
    const db = await promiseDb;
    const sql = `UPDATE employee
    SET manager_id = ?
    WHERE id = ?`;
    const result = await db.query(sql, [manager_id, id]);
    return result[0];
}

//get array of employees by manager
async getEmployeesByManager(manager_id) {
    const db = await promiseDb;
    const sql = `SELECT e.id AS employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employee,
    role.title AS title,
    department.name AS department,
    IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'Top Manager') AS manager,
    e.created_at FROM employee e
    LEFT JOIN role
    ON e.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee m ON
    m.id = e.manager_id WHERE e.manager_id = ?`;
    const result = await db.query(sql, manager_id);
    return result[0];
}

//get array of employees by department
async getEmployeesByDepartment(department_id) {
    const db = await promiseDb;
    const sql = `SELECT e.id AS employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employee,
    role.title AS title,
    department.name AS department,
    IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'Top Manager') AS manager,
    e.created_at FROM employee e
    LEFT JOIN role
    ON e.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee m ON
    m.id = e.manager_id WHERE department.id = ?`;
    const result = await db.query(sql, department_id);
    return result[0];
}

//delete employee by id
async deleteEmployee(id) {
    const db = await promiseDb;
    const sql = `DELETE FROM employee WHERE id = ?`
    const result = await db.query(sql, id);
    return result[0];
}

}

module.exports = SQLFunctions;






