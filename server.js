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
                    choices: ["Get Records", "Add Record", "Update Record", "Exit"]
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
            await AddRecord(ans);
        } else if (ans.operation === "Get Records") {
            await GetRecords(ans);
        } else if(ans.operation === "Update Record") {
            await UpdateRecord(ans);
        }
    }
}

async function UpdateRecord(ans){
    switch (ans.recordType) {
        case "Employee":
            await updateEmployeePrompt();
            break;

        case "Department":

        case "Role":

        default:
            console.log(`Update function not implemented for ${ans.recordType}`);
            break;
    }
};

async function updateEmployeePrompt(){
    let employees = await io.GetEmployees();
    let choices = employees.map(emp => ({value: emp.ID, name: emp.FirstName + " " + emp.LastName}));

    let ans = await inq
        .prompt([
            {
                name: "employee",
                message: "Selectt Employee to update: ",
                type: "list",
                choices: choices
            }
        ]);

    let selectEmp = employees.find(el => el.ID === ans.employee);

    console.log(selectEmp);

    let updatedEmp = await reusableEmployeePrompt(selectEmp.FirstName, selectEmp.LastName, selectEmp.RoleID, selectEmp.ManagerID);

    let res = await io.UpdateEmployee(ans.employee, updatedEmp.firstName, updatedEmp.lastName, updatedEmp.role, updatedEmp.manager);

    console.log(res);
};

async function GetRecords(ans) {
    switch (ans.recordType) {
        case "Employee":
            await displayEmployees();
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

async function AddRecord(ans) {
    switch (ans.recordType) {
        case "Employee":
            await addEmployeePrompt();
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
}

async function addEmployeePrompt() {

    let ans = await reusableEmployeePrompt();

    let newID = await io.AddEmployee(ans.firstName, ans.lastName, ans.role, ans.manager);

    console.log(`New Employee Created: ${ans.firstName} ${ans.lastName} in ${ans.role} role reporting to ${ans.manager} with ID ${newID}`);
 };

async function reusableEmployeePrompt(currFirstName = null, currLastName = null, currRole = null, currManager = null) {
    let roles = await getRoleChoices();
    let managers = await getManagerChoices();

    let roleIndex = roles.findIndex(el => el.value === currRole);
    let managerIndex = managers.findIndex(el => el.value === currManager);

    return await inq
        .prompt([
            {
                name: "firstName",
                message: "Enter first name:",
                type: "input",
                validate: (res) => {
                    return validateFieldLength(res, 1, 30);
                },
                default: currFirstName
            },
            {
                name: "lastName",
                message: "Enter last name:",
                type: "input",
                validate: (res) => {
                    return validateFieldLength(res, 1, 30);
                },
                default: currLastName
            },
            {
                name: "role",
                message: "Select Role:",
                type: "list",
                choices: roles,
                default: roleIndex
            },
            {
                name: "manager",
                message: "Select Manager:",
                type: "list",
                choices: managers,
                default: managerIndex
            }
        ]);
}

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

    let newID = await io.AddRole(ans.title, ans.salary, ans.department);

    console.log(`New role ${ans.title} in the ${ans.department} with a salary of ${ans.salary} with an ID of ${newID}.`);
 };
async function displayEmployees() {
    let res = await io.GetEmployees();

    res = res.map(emp => ({"Employee ID": emp.ID, "First Name": emp.FirstName, "Last Name": emp.LastName, "Role ID": emp.RoleID, "Manager ID": emp.ManagerID}));

    console.table(res);
 };

async function displayDepartments() {
    let res = await io.GetDepartments();

    res = res.map(dep => ({"Department ID": dep.ID, "Department Name": dep.Name}))

    console.table(res);
 };

async function displayRoles() { 
    let res = await io.GetRoles();

    res = res.map(role => ({"Role ID": role.ID, "Title": role.Title, "Salary": role.Salary, "Department ID": role.DepartmentID}));

    console.table(res);
}

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

async function getRoleChoices(){
    let res = await io.GetRoles();

    res = res.map(role => ({"value": role.ID, "name": role.Title,}));

    return res;
}

async function getManagerChoices() {
    let res = await io.GetEmployees();

    res = res.map(emp => ({"value": emp.ID, "name": emp.FirstName + " " + emp.LastName}));
    
    return [{value: null, name: "N/A"}].concat(res);
}