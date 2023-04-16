USE Employee_DB;

INSERT INTO Department (Name)
VALUES ("Coaching"), ("HR"), ("Marketing"), ("Player");

INSERT INTO Role (Title, Salary, DepartmentID)
VALUES 
	("Head Coach", 125000, 1),
    ("Assistant Coach", 90000, 1),
	("Cheif Officer", 95000, 2),
    ("Owner", 200000, 2),
    ("Social Media Expert", 65000, 3),
    ("Team Captain", 100000, 4),
    ("Senior Player", 85000, 4),
    ("Junior Player", 70000, 4);

INSERT INTO Employee (FirstName, LastName, RoleID, ManagerID)
VALUES
	("Rebecca", "Welton", 4, NULL),
    ("Ted", "Lasso", 1, 1),
    ("Coach", "Beard", 2, 2),
    ("Higgins", "G", 3, 1),
    ("Keeley", "Jones", 5, 1),
    ("Roy", "Kent", 6, 2),
    ("Jamie", "Tart", 7, 2),
    ("Dani", "Rojas", 8, 2),
    ("Sam", "Obisanya", 7, 2);