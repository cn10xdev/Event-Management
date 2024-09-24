# Event Management Admin

The admin side of an event management system build with the MERN Stack 

![overview](assets/overview.gif)

<details>
<summary>Click to see images</summary>
<br>

### Login

Authentication with sessions

![login page](assets/login.png)

### Users

Users page gives an overview of all the users registered. We can search and add
users. A report of all the students can also be generated as a CSV.

![users page](assets/users.png)

![user modal](assets/user_modal.png)

![add user](assets/add_user.png)

### Events

Events page contains all the events filtered by day. We can add new events here,
edit the existing ones or generate reports for each event.

![events page](assets/events.png)

![edit event](assets/event_modal.png)

![add event](assets/add_event.png)

### Payments

The Payments page displays a list of all payments made. We can search
these payments based on the user's roll number or the username of the admin
who registered the payment.

![payments](assets/payments.png)

</details>

## Web

- `react` as the front end framework
- `chakra-ui` a component library
- `react-icons` for icons
- `swr` for data fetching
- `downloadjs` to trigger downloads

## Server

- `express` server
  - `express-sessions` for managing sessions
  - `connect-mongo` to store the sessions in the database
- `mongodb` as database
  - `mongoose` ODM
  - `validator` for validation
  - `faker` for seeding the database
- Others
  - `argon2` for hashing
  - `pdf-creator-node` for generating reports
  - `rword` for generating passowrds
  - `nodemailer` for sending mails

## **Development Setup**

### **Prerequisites**

Ensure you have the following installed:

* **Git**  
* **Node.js**
* **You also need to have a MongoDB cluster URL and SendGrid API key and password**

# Project Setup Guide

## Frontend

1. Navigate to web folder and install dependencies

   ```sh
   cd web
   npm i
   ```

2. Start the react app

   ```sh
   npm start
   ```

## Backend

1. Navigate to web folder and install dependencies

   ```sh
   cd server
   npm i
   ```

2. Add a .env in the root directory. Here's an example env file for you.

   ```sh
    MONGO_URL =
    senderEmail = 
    senderPass =
    sendgridKey = 
   ```

2. Start the backend server

   ```sh
   npm run dev
   ```

### To add seed data to the database
1. Navigate to server folder and run file seed.js<br>
  
   ```sh
   cd server
   node seed.js
   ```
2. Then for login use the following credentials:<br>
- Username: **hello** <br>
- Password: **generalk123**
