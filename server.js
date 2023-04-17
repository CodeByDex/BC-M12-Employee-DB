const inq = require("inquirer");
const io = require("./lib/IO");
const val = require("./lib/Validation");
require("console.table");

/**********************************************************
 * Application Flow
 **********************************************************/
let runApp = true;

mainMenu();

async function mainMenu() {
    while (runApp) {
        try {
            let ans = await mainMenuPrompt();

            if (ans.operation === "Exit" || ans.recordType === "Exit") {
                runApp = false;
                return;
            }

            if (ans.operation === "Add Record") {
                await AddRecord(ans);
            } else if (ans.operation === "Get Records") {
                await GetRecords(ans);
            } else if (ans.operation === "Update Record") {
                await UpdateRecord(ans);
            } else if (ans.operation === "Run Report") {
                await runReportPrompt();
            } else if (ans.operation === "Delete Record") {
                await DeleteRecord(ans);
            }
        } catch (ex) {
            console.log("An error has occured");
            console.error(ex);
            runApp = false;
        }
    }
}

/**************************************************
 * Prompts
 ***************************************************/
async function mainMenuPrompt() {
    return await inq
        .prompt([
            {
                name: "operation",
                message: "What Operation would you like to perform?",
                type: "list",
                choices: ["Get Records", "Add Record", "Update Record", "Run Report", "Exit", "Delete Record"]
            },
            {
                name: "recordType",
                message: "What Record Type Are You Trying to Access?",
                type: "list",
                choices: ["Employee", "Department", "Role", "Exit"],
                when: (ans) => {
                    return (ans.operation != "Exit" && ans.operation != "Run Report");
                }
            }
        ]);
}

async function runReportPrompt(){
    let rep;
    let ans = await inq
        .prompt([{
            name: "report",
            message: "Please select a report to run: ",
            type: "list",
            choices: ["Employees by Manager", "Employees by Department", "Department Budget"]
        }]);

    if (ans.report === "Employees by Manager")
    {
        rep = await io.ReportEmployeesByManager()
    } else if (ans.report === "Employees by Department")
    {
        rep = await io.ReportEmployeesByDepartment()
    } else if (ans.report === "Department Budget")
    {
        rep = await io.ReportDepartmentBudget()
    } 

    console.table(rep);
}

async function updateEmployeePrompt() {
    let employees = await io.GetEmployees();
    let choices = await getEmployeeChocies();

    let ans = await inq
        .prompt([
            {
                name: "employee",
                message: "Select Employee to update: ",
                type: "list",
                choices: choices
            }
        ]);

    let selectEmp = employees.find(el => el.ID === ans.employee);

    let updatedEmp = await reusableEmployeePrompt(selectEmp.FirstName, selectEmp.LastName, selectEmp.RoleID, selectEmp.ManagerID);

    let res = await io.UpdateEmployee(ans.employee, updatedEmp.firstName, updatedEmp.lastName, updatedEmp.role, updatedEmp.manager);

    console.log(`Updated ${res} row(s)`);
};

async function deleteEmployeePrompt() {
    let choices = await getEmployeeChocies();

    let ans = await resuableDeletePrompt("Employee", choices);

    if (ans.confirm === "Yes") {
        let res = await io.DeleteEmployee(ans.id);
        console.log(`Deleted ${res} rows(s)`);
    }
}

async function resuableDeletePrompt(prompt, choices) {
    return await inq
        .prompt([
            {
                name: "id",
                message: `Select ${prompt} to delete: `,
                type: "list",
                choices: choices
            },
            {
                name: "confirm",
                message: "Confirm Delete; this cannot be undone?",
                type: "list",
                choices: ["No", "Yes"]
            }
        ]);
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
                    return val.validateFieldLength(res, 1, 30);
                },
                default: currFirstName
            },
            {
                name: "lastName",
                message: "Enter last name:",
                type: "input",
                validate: (res) => {
                    return val.validateFieldLength(res, 1, 30);
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
    let ans = await resuableDepartmentPrompt();

    let newID = await io.AddDepartment(ans.name);

    console.log(`New Department ${ans.name} with ID: ${newID} created.`)
};

async function updateDepartmentPrompt() {
    let departments = await io.GetDepartments();
    let choices = departments.map(el => ({value: el.ID, name: el.Name}));

    let ans = await inq
        .prompt([
            {
                name: "dept",
                message: "Select Department to update:",
                type: "list",
                choices: choices
            }
        ]);

    let selectedDept = departments.find(el => el.ID === ans.dept);

    let updatedDept = await resuableDepartmentPrompt(selectedDept.Name);

    let newID = await io.UpdateDepartment(ans.dept, updatedDept.name);

    console.log(`New Department ${ans.name} with ID: ${newID} created.`);
};

async function deleteDepartmentPrompt(){
    let dept = await getDepartmentChoices();

    let ans = await resuableDeletePrompt("Department", dept);

    if (ans.confirm === "Yes"){
        let res = await io.DeleteDepartment(ans.id);
        console.log(`Deleted ${res} row(s)`);
    }
}

async function resuableDepartmentPrompt(currName = null) {
    return await inq
        .prompt([
            {
                name: "name",
                message: "Enter name of department",
                type: "input",
                validate: (res) => {
                    return val.validateFieldLength(res, 1, 30);
                },
                default: currName
            }
        ]);
}

async function addRolePrompt() {
    let ans = await reusableRolePrompt();

    let newID = await io.AddRole(ans.title, ans.salary, ans.department);

    console.log(`New role ${ans.title} in the ${ans.department} with a salary of ${ans.salary} with an ID of ${newID}.`);
};

async function deleteRolePrompt(){
    let roles = await getRoleChoices();

    let ans = await resuableDeletePrompt("Role", roles);

    if (ans.confirm === "Yes") {
        let res = await io.DeleteRole(ans.id);
        console.log(`Deleted ${res} row(s)`);
    }
}

async function updateRolePrompt(){
    let roles = await io.GetRoles();
    let choices = roles.map(role => ({ value: role.ID, name: role.Title }));

    let ans = await inq
        .prompt([
            {
                name: "role",
                message: "Select Role to update: ",
                type: "list",
                choices: choices
            }
        ]);

    let selectedRole = roles.find(el => el.ID === ans.role);

    let updatedEmp = await reusableRolePrompt(selectedRole.Title, selectedRole.Salary, selectedRole.DepartmentID);

    let res = await io.UpdateRole(ans.role, updatedEmp.title, updatedEmp.salary, updatedEmp.department);

    console.log(`Updated ${res} row(s)`);
};

async function reusableRolePrompt(currTitle = null, currSalary = null, currDept = null) {
    let departments = await getDepartmentChoices();
    let currDeptInd = departments.findIndex(el => el.value === currDept);

    let ans = await inq
        .prompt([
            {
                name: "title",
                message: "Enter title:",
                type: "input",
                validate: (res) => {
                    return val.validateFieldLength(res, 1, 30);
                },
                default: currTitle
            },
            {
                name: "salary",
                message: "Enter salary:",
                type: "input",
                validate: (res) => {
                    return val.validateNumberValue(res, 0, 250000);
                },
                default: currSalary
            }, {
                name: "department",
                message: "Select Department",
                type: "list",
                choices: departments,
                default: currDeptInd
            }
        ]);
    return ans;
}

/********************************************
 * Sub Menu Selections
 ********************************************/

async function UpdateRecord(ans) {
    switch (ans.recordType) {
        case "Employee":
            await updateEmployeePrompt();
            break;

        case "Role":
            await updateRolePrompt()
            break;

        case "Department":
            await updateDepartmentPrompt();
            break;
    }
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
            await addRolePrompt();
            break;

        default:
            console.log("Unrecoginized Record Type");
            runApp = false;
            break;
    }
}

async function DeleteRecord(ans) {
    switch (ans.recordType) {
        case "Employee":
            await deleteEmployeePrompt();
            break;

        case "Department":
            await deleteDepartmentPrompt();
            break;

        case "Role":
            await deleteRolePrompt();
            break;

        default:
            console.log("Unrecoginized Record Type");
            runApp = false;
            break;
    }
}

/*********************************
 * Display Functions
 ********************************/

async function displayEmployees() {
    let res = await io.GetEmployees();
    let roles = await io.GetRoles();

    res = res.map(emp => ({ 
        "Employee ID": emp.ID, 
        "First Name": emp.FirstName, 
        "Last Name": emp.LastName, 
        "Title": roles.find(x => x.ID === emp.RoleID).Title, 
        "Salary": roles.find(x => x.ID === emp.RoleID).Salary,
        "Manager": emp.ManagerID ? getManagerName(emp) : "N/A"
    }));

    console.table(res);

    function getManagerName(emp) {
        let man = res.find(x => x.ID === emp.ManagerID);
        return man.FirstName + " " + man.LastName;
    }
};

async function displayDepartments() {
    let res = await io.GetDepartments();

    res = res.map(dep => ({ "Department ID": dep.ID, "Department Name": dep.Name }))

    console.table(res);
};

async function displayRoles() {
    let res = await io.GetRoles();
    let dep = await io.GetDepartments();

    res = res.map(role => ({ "Role ID": role.ID, "Title": role.Title, "Salary": role.Salary, Department: dep.find(x => x.ID === role.DepartmentID).Name }));

    console.table(res);
};

/*************************
 * Choice List Functions
 **************************/

async function getDepartmentChoices() {
    let res = await io.GetDepartments();

    res = res.map(dep => ({ "value": dep.ID, "name": dep.Name }))

    return res;
}

async function getRoleChoices() {
    let res = await io.GetRoles();

    res = res.map(role => ({ "value": role.ID, "name": role.Title, }));

    return res;
}

async function getManagerChoices() {
    return [{ value: null, name: "N/A" }].concat(await getEmployeeChocies());
}

async function getEmployeeChocies() {
    let res = await io.GetEmployees();

    res = res.map(emp => ({ "value": emp.ID, "name": emp.FirstName + " " + emp.LastName }));

    return res;
}