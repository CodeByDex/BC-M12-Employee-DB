const fs = require("fs");
const ms = require("mysql2/promise");
const connectionInfo = JSON.parse(fs.readFileSync("./secrets.json"));

async function getConn()
{
    return await ms.createConnection({
        host: "localhost",
        user: connectionInfo.user,
        password: connectionInfo.password,
        database: "Employee_DB"
    });
}

async function GetDepartments(cb){
    const db = await getConn();

    db.query("SELECT * FROM Department;", (error, results) => {
        if (error) {
            console.error(error);
            cb("There was an error");
        } else {
            cb(results);
        }
    });

    db.close();
}

async function AddDepartment(departmentName){
    const db = await getConn();

    const [results, fields] = await db.execute("INSERT INTO Department (Name) VALUES (?);", [departmentName])
    
    db.close();

    return results.insertId;
}

module.exports = {
    GetDepartments: GetDepartments,
    AddDepartment: AddDepartment
}