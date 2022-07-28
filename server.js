const inquirer = require('inquirer');
const mysql = require('mysql2');
require(console.table);
const Department = require ('./lib/Department')
const {getDep, newDep, depArr, employeeArr, roleArr, updateRole, getEmployees} = require('./lib/helper')