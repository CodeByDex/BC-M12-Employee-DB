const inq = require("inquirer");
const io = require("./lib/IO");
require("console.table");

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
                    await displayEmployees()
                    break;

                case "Department":
                    await displayDepartments();
                    break;

                case "Role":
                    await displayRoles();
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
    let roles = await getRoleChoices();
    let managers = await getManagerChoices();

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


    let newID = await io.AddDepartment(ans.name);

    console.log(`New Department ${ans.name} with ID: ${newID} created.`)
};

async function addRole() {
    let departments = await getDepartmentChoices();
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
async function displayEmployees() { };

async function displayDepartments() {
    let res = await io.GetDepartments();

    res = res.map(dep => ({"Department ID": dep.ID, "Department Name": dep.Name}))

    console.table(res);
 };

async function displayRoles() { };

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

async function getDepartmentChoices(){
    let res = await io.GetDepartments();

    res = res.map(dep => ({"value": dep.ID, "name": dep.Name}))
   
    return res;
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