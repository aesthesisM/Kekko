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
DB_NAME=kekko
DB_USER=kekkoDB
DB_PASSWORD=11231123
DB_HOST=172.16.169.129
DB_PORT=3306

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