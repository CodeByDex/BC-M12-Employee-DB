const fs = require("fs");
const ms = require("mysql2/promise");
const connectionInfo = JSON.parse(fs.readFileSync("./secrets.json"));

async function getConn() {
    return await ms.createConnection({
        host: "localhost",
        user: connectionInfo.user,
        password: connectionInfo.password,
        database: "Employee_DB"
    });
}

module.exports = {
    GetDepartments: GetDepartments,
    AddDepartment: AddDepartment,
    GetRoles: GetRoles,
    AddRole: AddRole,
    GetEmployees: GetEmployees,
    AddEmployee: AddEmployee,
    UpdateEmployee: UpdateEmployee,
    UpdateDepartment: UpdateDepartment,
    UpdateRole: UpdateRole,
    ReportEmployeesByManager: ReportEmployeesByManager
}

/**************
 * Create
 *************/
async function AddDepartment(departmentName) {
    const db = await getConn();

    const [results, fields] = await db.execute("INSERT INTO Department (Name) VALUES (?);", [departmentName])

    db.close();

    return results.insertId;
}

async function AddRole(roleTitle, salary, departmentID) {
    const db = await getConn();

    const [results, fields] = await db.execute("INSERT INTO Role (Title, Salary, DepartmentID) VALUES (?, ?, ?);", [roleTitle, salary, departmentID])

    db.close();

    return results.insertId;
}

async function AddEmployee(FirstName, LastName, RoleID, ManagerID) {
    const db = await getConn();

    const [results, fields] = await db.execute("INSERT INTO Employee (FirstName, LastName, RoleID, ManagerID) VALUES (?, ?, ?, ?);", [FirstName, LastName, RoleID, ManagerID])

    db.close();

    return results.insertId;
}

/**************
 * Read
 *************/

async function GetDepartments() {
    const db = await getConn();

    const [results, fields] = await db.execute("SELECT * FROM Department;");

    db.close();

    return results;
}


async function GetRoles() {
    const db = await getConn();

    const [results, fields] = await db.execute("SELECT * FROM Role;");

    db.close();

    return results;
}


async function GetEmployees() {
    const db = await getConn();

    const [results, fields] = await db.execute("SELECT * FROM Employee;");

    db.close();

    return results;
}

/*****************
 * Update
 *****************/

async function UpdateEmployee(EmployeeID, FirstName, LastName, RoleID, ManagerID) {
    const db = await getConn();

    const [results, fields] = await db.execute("UPDATE Employee SET FirstName = ?, LastName = ?, RoleID = ?, ManagerID = ? WHERE ID = ?;", [FirstName, LastName, RoleID, ManagerID, EmployeeID])

    db.close();

    return results.affectedRows;
}

async function UpdateDepartment(DepartmentID, departmentName) {
    const db = await getConn();

    const [results, fields] = await db.execute("UPDATE Department SET Name = ? WHERE ID = ?;", [departmentName, DepartmentID])

    db.close();

    return results.affectedRows;
}

async function UpdateRole(RoleID, roleTitle, salary, departmentID) {
    const db = await getConn();

    const [results, fields] = await db.execute("UPDATE Role SET Title = ?, Salary = ?, DepartmentID = ? WHERE ID = ?;", [roleTitle, salary, departmentID, RoleID])

    db.close();

    return results.affectedRows;
}

/*****************
 * Delete
 ****************/


/****************
 * Reports
 *******************/

async function ReportEmployeesByManager(){
    const db = await getConn();

    const [results, fields] = await db.execute(`SELECT
	CONCAT(M.FirstName, " ", M.LastName) AS Manager,
    CONCAT(E.FirstName, " ", E.LastName) AS Employee
FROM
	Employee AS E
    INNER JOIN Employee AS M ON
		E.ManagerID = M.ID
ORDER BY
	1, 2`);

    db.close();

    return results;
};