const inq = require("inquirer");

let runApp = true;

mainMenu();

async function mainMenu() {
    while (runApp) {
        let ans = await inq
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
            ]);

        if (ans.operation === "Exit" || ans.recordType === "Exit") {
            runApp = false;
            return;
        }

        if (ans.operation === "Add Record") {
            switch (ans.recordType) {
                case "Employee":
                    await addEmployeePrompt()
                    break;

                case "Department":
                    await addDepartmentPrompt();
                    break;

                case "Role":
                    await addRole();
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
    }
}

async function addEmployeePrompt() {
    let roles = getRoleChoices();
    let managers = getManagerChoices();

    let ans = await inq
        .prompt([
            {
                name: "firstName",
                message: "Enter first name:",
                type: "input",
                validate: (res) => {
                    return validateFieldLength(res, 1, 30);
                }
            },
            {
                name: "lastName",
                message: "Enter last name:",
                type: "input",
                validate: (res) => {
                    return validateFieldLength(res, 1, 30);
                }
            },
            {
                name: "role",
                message: "Select Role:",
                type: "list",
                choices: roles
            },
            {
                name: "manager",
                message: "Select Manager:",
                type: "list",
                choices: managers
            }
        ]);

    console.log(`New Employee Created: ${ans.firstName} ${ans.lastName} in ${ans.role} role reporting to ${ans.manager}`)
 };
async function addDepartmentPrompt() { 
    let ans = await inq
        .prompt([
            {
                name: "name",
                message: "Enter name of department",
                type: "input",
                validate: (res) => {
                    return validateFieldLength(res, 1, 30);
                }
            }
        ]);

    console.log(`Created new department: ${ans.name}`);
};
async function addRole() {
    let departments = getDepartmentChoices();
    let ans = await inq
        .prompt([
            {
                name: "title",
                message: "Enter title:",
                type: "input",
                validate: (res) => {
                    return validateFieldLength(res, 1, 30);
                }
            },
            {
                name: "salary",
                message: "Enter salary:",
                type: "input",
                validate: (res) => {
                    return validateNumberValue(res, 0, 250000);
                }
            }, {
                name: "department",
                message: "Select Department",
                type: "list",
                choices: departments
            }
        ])

    console.log(`New role ${ans.title} in the ${ans.department} with a salary of ${ans.salary}.`)
 };
function displayEmployees() { };
function displayDepartments() { };
function displayRoles() { };

function validateNumberValue(num, min, max) {
    if(num === "" || isNaN(num)){
        return false;
    } else if(num >= min && num <= max){
        return true;
    } else {
        return false;
    }
}

function validateFieldLength(res, min, max) {
    if (res.length >= min && res.length <= max) {
        return true;
    } else {
        return false;
    }
};

function getDepartmentChoices(){
    return [{
        value: 1,
        name: "IT"
    },{
        value: 2,
        name: "Trading"
    }]
}

function getRoleChoices(){
    return [{
        value: 1,
        name: "Manager"
    },{
        value: 2,
        name: "Employee"
    }]
}

function getManagerChoices() {
    return [{
        value: 1,
        name: "Jack Johnson"
    },{
        value: 2,
        name: "Ted Lasso"
    }]
}