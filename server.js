const inq = require("inquirer");

let runApp = true;

inq 
    .prompt([
        {
            name: "operation",
            message: "What Operation would you like to perform?",
            type: "list",
            choices: ["Get Records", "Add Record", "Exit"]
        },
        {
            name: "recordType",
            message: "What Record Type Are You Trying to Access?",
            type: "list",
            choices: ["Employee", "Department", "Role", "Exit"],
            when: (ans) => {
                return ans.operation != "Exit"
            }
        }
    ])
    .then((ans) => {
        if (ans.operation === "Exit" || ans.recordType === "Exit") {
            runApp = false;
            return;
        }

        if (ans.operation === "Add Record") {
            switch (ans.recordType) {
                case "Employee":
                    addEmployeePrompt()
                    break;

                case "Department":
                    addDepartmentPrompt();
                    break;

                case "Role":
                    addRole();
                    break;
            
                default:
                    console.log("Unrecoginized Record Type");
                    runApp = false;
                    break;
            }
        } else {
            switch (ans.recordType) {
                case "Employee":
                    displayEmployees()
                    break;

                case "Department":
                    displayDepartments();
                    break;

                case "Role":
                    displayRoles();
                    break;
            
                default:
                    console.log("Unrecoginized Record Type");
                    runApp = false;
                    break;
            }
        }
    });

function addEmployeePrompt() {};
function addDepartmentPrompt() {};
function addRole() {};
function displayEmployees() {};
function displayDepartments() {};
function displayRoles() {};