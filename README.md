# Kekko
Kekko bambam

## Getting Started
### Getting the code
```
$ git clone https://github.com/aesthesisM/Kekko.git
$ cd Kekko
```
## Prerequisites
### Create database :
```

Currently only mysql:
1. CREATE DATABASE kekko CHARACTER SET utf8 COLLATE utf8_general_ci;
2. if you are running mysql on the same host with node.js
       CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
    else you are running mysql on different host
        CREATE USER 'username'@'%' IDENTIFIED BY 'password';
3. GRANT ALL PRIVILEGES ON kekko. * TO 'username'@'localhost'; 
   or
   GRANT ALL PRIVILEGES ON kekko. * TO 'username'@'%';
4. flush privileges;
```
### Edit .env file 
```
ENVIRONMENT=Development
DB_NAME=<db_name>
DB_USER=<db_user>
DB_PASSWORD=<db_password>
DB_HOST=<db_host>
DB_PORT=<db_port>

```
## Installing
```
$ npm install
```
## Running
```
$ npm start
```
Now you can visit [http://127.0.0.1:50000](http://127.0.0.1:50000)




## License
This project is licensed under the MIT License