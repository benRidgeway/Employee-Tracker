const inquirer = require('inquirer');
const cTable = require('console.table');

const SQLFunctions = require('./SQLFunctions');
const Database = new SQLFunctions;

class Session {

    constructor() {
        //list of all main menu options
        this.menuOptions = [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'View Employees by Manager',
            'View Employees by Department',
            'View Department Budget',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Update an Employee Manager',
            'Delete Department',
            'Delete Role',
            'Delete Employee',
            'Exit.'
        ]
    }

    //runs at Session start
    async initializeSession() {
        console.log('Session Started.');
        console.log('Welcome to the Employee Tracker App')
        this.mainMenu();

    }

    //displays all main menu options to the user and handles the selection.
    async mainMenu() {
        console.log("Main Menu");

        inquirer
            .prompt({
                type: 'list',
                message: 'What would you like to do?',
                name: 'choice',
                choices: this.menuOptions
            })
            .then(async ({ choice }) => {
                if (choice === 'View All Departments') {

                    //query Database and return array of record objects
                    const result = await Database.getDepartments();
                    //display array as table
                    console.table(result);
                    //prompt the user to continue or not
                    this.confirmContinue();

                } else if (choice === 'View All Roles') {

                    const result = await Database.getRoles();
                    console.table(result);
                    this.confirmContinue();

                } else if (choice === 'View All Employees') {

                    const result = await Database.getEmployees();
                    console.table(result);
                    this.confirmContinue();

                } else if (choice === 'View Employees by Manager') {

                    //returns array of employees that have at least 1 direct report
                    let managers = await Database.getManagers();

                    inquirer
                        .prompt({
                            type: 'list',
                            name: 'managerName',
                            message: "Please select a Manager.",
                            choices: () => {
                                //create array of manager names from role query above to use as choices
                                let choices = [];
                                for (let i = 0; i < managers.length; i++) {
                                    choices.push(managers[i].manager);
                                }
                                return choices;
                            }
                        })
                        .then(async ({ managerName }) => {
                            //filter manager array to match the given managerName and return its ID as managerId
                            let managerId = (managers.filter(obj => {
                                return obj.manager === managerName;
                            }))[0].id;

                            //Query the database and log the result.
                            const result = await Database.getEmployeesByManager(managerId);
                            if (result[0]) {
                                console.table(result);
                            } else {
                                console.log(`Invalid Input.`)
                            }

                            //prompt the user to continue or not
                            this.confirmContinue();
                        });

                } else if (choice === 'View Employees by Department') {

                    let departments = await Database.getDepartments();

                    inquirer
                        .prompt({
                            type: 'list',
                            name: 'departmentName',
                            message: "Please select a Department.",
                            choices: () => {
                                let choices = [];
                                for (let i = 0; i < departments.length; i++) {
                                    choices.push(departments[i].department);
                                }
                                return choices;
                            }
                        })
                        .then(async ({ departmentName }) => {
                            let departmentId = (departments.filter(obj => {
                                return obj.department === departmentName;
                            }))[0].department_id;
                            const result = await Database.getEmployeesByDepartment(departmentId);
                            if (result[0]) {
                                console.table(result);
                            } else {
                                console.log(`Department ID ${departmentId} does not exist.`)
                            }

                            this.confirmContinue();
                        });

                } else if (choice === 'View Department Budget') {

                    let departments = await Database.getDepartments();

                    inquirer
                        .prompt({
                            type: 'list',
                            name: 'departmentName',
                            message: "Please select a Department.",
                            choices: () => {
                                let choices = [];
                                for (let i = 0; i < departments.length; i++) {
                                    choices.push(departments[i].department);
                                }
                                return choices;
                            }
                        })
                        .then(async ({ departmentName }) => {
                            let departmentId = (departments.filter(obj => {
                                return obj.department === departmentName;
                            }))[0].department_id;
                            const result = await Database.getBudget(departmentId);
                            if (result[0]) {
                                console.table(result);
                            } else {
                                console.log(`Department ID ${departmentId} does not exist.`)
                            }

                            this.confirmContinue();
                        });

                } else if (choice === 'Add a Department') {

                    inquirer
                        .prompt({
                            type: 'text',
                            name: 'departmentName',
                            message: "Please enter the name of the new Department."
                        })
                        .then(async ({ departmentName }) => {
                            if (!departmentName) {
                                console.log("Invalid Input.")
                                this.confirmContinue();
                            } else {

                                const result = await Database.newDepartment(departmentName);
                                if (result.affectedRows === 1) {
                                    console.log(`Department ${departmentName} created with ID ${result.insertId}`);
                                } else {
                                    console.log('Invalid Input');
                                }

                                this.confirmContinue();

                            }
                        });

                } else if (choice === 'Add a Role') {

                    //query departments and return array of departments
                    let departments = await Database.getDepartments();

                    inquirer
                        .prompt([
                            {
                                type: 'text',
                                name: 'title',
                                message: "Please enter the title of the new Role."
                            },
                            {
                                type: 'number',
                                name: 'salary',
                                message: 'Please enter the annual salary of the new Role (Max 7 digits).'
                            },
                            {
                                type: 'list',
                                name: 'departmentName',
                                message: 'Please select the Department for the New Role.',
                                choices: () => {
                                    //create array of department names from departments query above
                                    let choices = [];
                                    for (let i = 0; i < departments.length; i++) {
                                        choices.push(departments[i].department);
                                    }
                                    return choices;
                                }
                            }
                        ])
                        .then(async ({ title, salary, departmentName }) => {
                            if (!title || !salary || !departmentName) {
                                console.log("Invalid Input.")
                                this.confirmContinue();
                            } else {
                                //gets department ID by filtering the array of departments
                                //by the selected departmentName
                                let departmentId = (departments.filter(obj => {
                                    return obj.department === departmentName;
                                }))[0].department_id;
                                const result = await Database.newRole(title, salary, departmentId);
                                if (result.affectedRows === 1) {
                                    console.log(`Role: ${title} created with ID ${result.insertId}`);
                                } else {
                                    console.log('Invalid Input');
                                }

                                this.confirmContinue();
                            }
                        });

                } else if (choice === 'Add an Employee') {

                    //query roles and return array of roles
                    let roles = await Database.getRoles();
                    //query employees and return array of employees
                    let managers = await Database.getEmployees();

                    inquirer
                        .prompt([
                            {
                                type: 'text',
                                name: 'firstName',
                                message: "Please enter the Employee's first name."
                            },
                            {
                                type: 'text',
                                name: 'lastName',
                                message: "Please enter the Employee's last name."
                            },
                            {
                                type: 'list',
                                name: 'roleName',
                                message: "Please select the Employee's role.",
                                choices: () => {
                                    //create array of role names from role query above
                                    let choices = [];
                                    for (let i = 0; i < roles.length; i++) {
                                        choices.push(roles[i].title);
                                    }
                                    return choices;
                                }
                            },
                            {
                                type: 'confirm',
                                name: 'hasManager',
                                message: "Does the Employee report to a Manager?"
                            },
                            //Only asked if the user answers Y to the previous question
                            {
                                when: ({ hasManager }) => {
                                    if (hasManager) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                type: 'list',
                                name: 'managerName',
                                message: "Please select the Employee's Manager.",
                                choices: () => {
                                    //create array of department names from departments query above
                                    let choices = [];
                                    for (let i = 0; i < managers.length; i++) {
                                        choices.push(managers[i].employee);
                                    }
                                    return choices;
                                }
                            }
                        ])
                        .then(async ({ firstName, lastName, roleName, hasManager, managerName }) => {
                            if (!firstName || !lastName || !roleName) {
                                console.log("Invalid Input.")
                                this.confirmContinue();
                            } else if (hasManager && !managerName) {
                                console.log("No valid Manager was selected.")
                            } else {
                                let roleId = (roles.filter(obj => {
                                    return obj.title === roleName;
                                }))[0].role_id;

                                if (!managerName) {
                                    var managerId = null;
                                } else {
                                    var managerId = (managers.filter(obj => {
                                        return obj.employee === managerName;
                                    }))[0].employee_id;
                                }

                                const result = await Database.newEmployee(firstName, lastName, roleId, managerId);
                                if (result.affectedRows === 1) {
                                    console.log(`Employee: ${firstName} ${lastName} created with ID ${result.insertId}`);
                                } else {
                                    console.log('Invalid Input');
                                }

                                this.confirmContinue();
                            }
                        });

                } else if (choice === 'Update an Employee Role') {

                    let employees = await Database.getEmployees();
                    let roles = await Database.getRoles();

                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'employeeName',
                                message: "Please select the Employee you wish to update.",
                                choices: () => {
                                    let choices = [];
                                    for (let i = 0; i < employees.length; i++) {
                                        choices.push(employees[i].employee);
                                    }
                                    return choices;
                                }
                            },
                            {
                                type: 'list',
                                name: 'roleName',
                                message: "Please select the Role to assign to the Employee.",
                                choices: () => {
                                    let choices = [];
                                    for (let i = 0; i < roles.length; i++) {
                                        choices.push(roles[i].title);
                                    }
                                    return choices;
                                }
                            },
                        ])
                        .then(async ({ employeeName, roleName }) => {
                            if (!employeeName || !roleName) {
                                console.log("Invalid Input.")
                                this.confirmContinue();
                            } else {
                                let roleId = (roles.filter(obj => {
                                    return obj.title === roleName;
                                }))[0].role_id;
                                let employeeId = (employees.filter(obj => {
                                    return obj.employee === employeeName;
                                }))[0].employee_id;
                                const result = await Database.updateRole(roleId, employeeId);
                                if (result.changedRows === 1) {
                                    console.log(`Employee ID: ${employeeId} has been assigned Role ID: ${roleId}`);
                                } else {
                                    console.log('Invalid Input');
                                }

                                this.confirmContinue();

                            }
                        });

                } else if (choice === 'Update an Employee Manager') {

                    let employees = await Database.getEmployees();

                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'employeeName',
                                message: "Please select the Employee you wish to update.",
                                choices: () => {
                                    let choices = [];
                                    for (let i = 0; i < employees.length; i++) {
                                        choices.push(employees[i].employee);
                                    }
                                    return choices;
                                }
                            },
                            {
                                type: 'confirm',
                                name: 'hasManager',
                                message: "Does the Employee report to a Manager?"
                            },
                            //Only asked if the user answers Y to the previous question
                            {
                                when: ({ hasManager }) => {
                                    if (hasManager) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                type: 'list',
                                name: 'managerName',
                                message: "Please assign a Manager to this Employee.",
                                choices: () => {
                                    let choices = [];
                                    for (let i = 0; i < employees.length; i++) {
                                        choices.push(employees[i].employee);
                                    }
                                    return choices;
                                }
                            }
                        ])
                        .then(async ({ employeeName, hasManager, managerName }) => {
                            if (!employeeName) {
                                console.log("Invalid Input.");
                                this.confirmContinue();
                            } else if (hasManager && !managerName) {
                                console.log("No valid Manager was entered.");
                                this.confirmContinue();
                            } else if (employeeName === managerName) {
                                console.log("An Employee cannot be assigned as their own manager!");
                                this.confirmContinue();
                            } else {
                                let employeeId = (employees.filter(obj => {
                                    return obj.employee === employeeName;
                                }))[0].employee_id;

                                //If employee has no manager, set managerId to null,
                                //otherwise match managerName to manager's employee_id
                                if (!hasManager) {
                                    var managerId = null;
                                } else {
                                    var managerId = (employees.filter(obj => {
                                        return obj.employee === managerName;
                                    }))[0].employee_id;
                                }

                                const result = await Database.updateManager(managerId, employeeId);
                                if (result.changedRows === 1) {
                                    if (!managerId) {
                                        console.log(`Employee ID: ${employeeId} is now a Top Manager.`);
                                    } else {
                                        console.log(`Employee ID: ${employeeId} has been assigned Manager ID: ${managerId}`);
                                    }

                                } else {
                                    console.log('Invalid Input');
                                }

                                this.confirmContinue();

                            }
                        });

                } else if (choice === 'Delete Department') {

                    let departments = await Database.getDepartments();

                    inquirer
                        .prompt({
                            type: 'list',
                            name: 'departmentName',
                            message: "Please select the Department to Delete.",
                            choices: () => {
                                let choices = [];
                                for (let i = 0; i < departments.length; i++) {
                                    choices.push(departments[i].department);
                                }
                                return choices;
                            }
                        })
                        .then(async ({ departmentName }) => {
                            let departmentId = (departments.filter(obj => {
                                return obj.department === departmentName;
                            }))[0].department_id;
                            const result = await Database.deleteDepartment(departmentId);
                            if (result.affectedRows === 1) {
                                console.log(`Department with ID: ${departmentId} was deleted.`)
                            } else {
                                console.log(`Department ID: ${departmentId} does not exist.`)
                            }

                            this.confirmContinue();
                        });


                } else if (choice === 'Delete Role') {

                    let roles = await Database.getRoles();

                    inquirer
                        .prompt({
                            type: 'list',
                            name: 'roleName',
                            message: "Please select the Role to Delete.",
                            choices: () => {
                                let choices = [];
                                for (let i = 0; i < roles.length; i++) {
                                    choices.push(roles[i].title);
                                }
                                return choices;
                            }
                        })
                        .then(async ({ roleName }) => {

                            let roleId = (roles.filter(obj => {
                                return obj.title === roleName;
                            }))[0].role_id;

                            const result = await Database.deleteRole(roleId);
                            if (result.affectedRows === 1) {
                                console.log(`Role with ID: ${roleId} was deleted.`)
                            } else {
                                console.log(`Role ID: ${roleId} does not exist.`)
                            }

                            this.confirmContinue();
                        });

                } else if (choice === 'Delete Employee') {

                    let employees = await Database.getEmployees();

                    inquirer
                        .prompt({
                            type: 'list',
                                name: 'employeeName',
                                message: "Please select the Employee you wish to Delete.",
                                choices: () => {
                                    let choices = [];
                                    for (let i = 0; i < employees.length; i++) {
                                        choices.push(employees[i].employee);
                                    }
                                    return choices;
                                }
                        })
                        .then(async ({ employeeName }) => {

                            let employeeId = (employees.filter(obj => {
                                return obj.employee === employeeName;
                            }))[0].employee_id;

                            const result = await Database.deleteEmployee(employeeId);
                            if (result.affectedRows === 1) {
                                console.log(`Employee with ID: ${employeeId} was deleted.`)
                            } else {
                                console.log(`Employee ID: ${employeeId} does not exist.`)
                            }

                            this.confirmContinue();
                        });

                } else {
                    //if user selects Exit
                    this.endSession();
                }
            });
    }

    //prompts user if they want to continue after completing an operation
    async confirmContinue() {
        inquirer
            .prompt({
                type: 'confirm',
                message: 'Would you like to do something else?',
                name: 'confirmChoice',
                default: true
            })
            .then(({ confirmChoice }) => {
                if (confirmChoice) {
                    this.mainMenu();
                } else {
                    this.endSession();
                }
            })
    }

    //exits the program
    async endSession() {
        console.log("Bye!");
        process.exit();
    }

}

module.exports = Session;