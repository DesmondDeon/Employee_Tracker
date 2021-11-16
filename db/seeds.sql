INSERT INTO department(name)
VALUES("Engineering"), ("Sales"), ("Finance"), ("Legal");

INSERT INTO role
(title, salary, department_id)
VALUES
("Sales Lead", 100000, 1), 
("Salesperson", 80000, 2), 
("Lead Enigneer", 150000, 3), 
("Software Engineer", 120000, 4);

INSERT INTO employee(first_name, last_name, role_id )
VALUES 
('John', 'Doe', 2), 
('Mike', 'Chan', 3),
('Ashley', 'Rodriguez', 2), 
('Kevin', 'TUpik', 1),
('Malia', 'Brown', 2);


UPDATE employee SET manager_id = 3 WHERE id = 1 OR id = 4;
UPDATE employee SET manager_id = 1 WHERE id = 2;
