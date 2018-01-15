CREATE TABLE staffs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dept VARCHAR(255) NOT NULL,
    phone INT NOT NULL,
    aadharNumber BIGINT NOT NULL,
    pic VARCHAR(255),
    dob TIMESTAMP NOT NULL,
    address VARCHAR(255) NOT NULL,
    bloodGroup VARCHAR(20) NOT NULL,
    community VARCHAR(60) NOT NULL,
);
