-- view all roles
SELECT role.id AS role_id,
    role.title,
    role.salary,
    department.name AS department_name FROM role
LEFT JOIN department
ON role.department_id = department.id;

-- view all employees
SELECT e.id AS employee_id,
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
m.id = e.manager_id;

-- create new department
INSERT INTO department (name)
VALUES
    ('Test');

-- create new role
INSERT INTO role (title, salary, department_id)
VALUES ('HR', 80000, 4);

-- create new Employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Cara', 'Raehnerys', 9, 3);

-- Update employee role
UPDATE employee
SET role_id = 1;
WHERE id = 8;

-- Update Employee Manager
UPDATE employee
SET manager_id = 1;
WHERE id = 3;

-- view employees by manager
SELECT * FROM employee WHERE manager_id = 3;

-- view employees by department
SELECT department.name AS department_name, employee.id AS employee_id, employee.first_name, employee.last_name,  role.title FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id WHERE department.id = 3;

-- get department budget
SELECT department.id AS department_id, department.name AS department_name, SUM(role.salary) AS budget FROM department
RIGHT JOIN role ON department.id = role.department_id
RIGHT JOIN employee ON role.id = employee.role_id
WHERE department_id = 1;

-- delete department
DELETE FROM department WHERE id = 1;

-- view only Managers with direct reports
SELECT e1.id AS id, CONCAT(e1.first_name, ' ', e1.last_name) AS 'Manager' FROM employee AS e1
    JOIN (SELECT manager_id FROM employee
            GROUP BY manager_id) AS e2
        ON e1.id = e2.manager_id;