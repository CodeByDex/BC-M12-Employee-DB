const fs = require("fs");
const ms = require("mysql2");
const connectionInfo = JSON.parse(fs.readFileSync("./secrets.json"));

const db = ms.createConnection({
    host: "localhost",
    user: connectionInfo.user,
    password: connectionInfo.password,
    database: "Employee_DB"
});

function GetDepartments(cb){
    db.query("SELECT * FROM Department;", (error, results) => {
        if (error) {
            console.error(error);
            cb("There was an error");
        } else {
            cb(results);
        }
    })
}

function AddDepartment(departmentName, cb){
    db.query("INSERT INTO Department (Name) VALUES (?);", [departmentName], (error, results) => {
        if (error) {
            console.error(error);
            cb("There was an error");
        } else {
            cb(results.insertedId);
        }
    })
}

module.exports = {
    GetDepartments: GetDepartments,
    AddDepartment: AddDepartment
}