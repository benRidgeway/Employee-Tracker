INSERT INTO department (names)
VALUES ("Customer-Service"), -- 1
       ("HR"), -- 2
       ("Sales"), -- 3
       ("Development"); -- 4

INSERT INTO roles (id, title, salary, department_id) 
VALUES (1, "Customer-Service Rep", 35000, 1), 
       (2, "Customer-Service Manager", 70000, 1), 
       (3, "Head HR", 150000, 2), 
       (4, "HR Rep", 75000, 2), 
       (5, "Head of Sales", 12000, 3), 
       (6, "Salesperson", 60000, 3), 
       (7, "Senior Dev", 120000, 4), 
       (8, "Junior Dev", 60000, 4); 

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Ron", "Jeremy", null, 1),
       ("Johnny", "Sins", 1, 2),
       ("Alexis", "Texas", null, 3),
       ("Riley", "Reid", 3, 4),
       ("Mia", "Khalifa", null, 5),
       ("Joshua", "Fluke", 5, 6),
       ("Joe", "Rogan", null, 7),
       ("Tim", "Allen", 7, 8);