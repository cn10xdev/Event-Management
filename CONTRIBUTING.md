# **Contributing to \[Open-Source Projects for Coding Ninjas Job Bootcamp\]**

First off, thank you for taking the time to contribute\! 🎉 Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

**Please follow the steps below to contribute to this project.**

## **Table of Contents**

1. Code of Conduct  
2. How Can I Contribute?  
   * Reporting Bugs  
   * Suggesting Enhancements  
   * Submitting Pull Requests  
3. Development Setup  
4. Style Guide  
5. Contact & Support

## **Code of Conduct**

This project and everyone participating in it are governed by the Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to CNDC@codingninjas.com.

## **How Can I Contribute?**

### **1\. Reporting Bugs**

If you find a bug, we’d love to hear about it\! Before reporting a bug, please ensure the issue hasn’t already been reported by:

* Checking the [issue tracker](https://github.com/cn10xdev/Event-Management/issues) to see if it exists.  
* If it’s not listed, [create a new issue](https://github.com/cn10xdev/Event-Management/issues/new). Include details such as:  
  * Steps to reproduce the bug.  
  * What you expected to happen.  
  * What actually happened.  
  * Screenshots, if applicable.

### **2\. Suggesting Enhancements**

Do you have a suggestion for improvement? Please open an issue with the following details:

* **Title**: Clear and descriptive.  
* **Motivation**: Why should we make this enhancement?  
* **Use Case**: How will this enhancement help users?  
* **Implementation** (if applicable): How do you think this could be built?

### **3\. Submitting Pull Requests**

Pull Requests (PRs) are welcome\! Before you start working on a major feature, it’s a good idea to discuss it with the maintainers to ensure it aligns with the project's direction.

#### **Steps for Submitting a Pull Request:**

1. **Fork the Repository**  
   Fork the repo by clicking the "Fork" button at the top of the project page on GitHub:  
   * [Open-Source Project Event Management Product](https://github.com/cn10xdev/Event-Management)  

**Clone the Repository**

**In your terminal, run the following command to clone your forked repository:**  
```bash
git clone https://github.com/YOUR_USERNAME/Event-Management.git 
cd Event-Management
```

2. **Create a Branch**  
   Create a branch for your contribution:  
   ```bash
   git checkout -b feature/your-feature-name
   ```
     
3. **Make Changes**  
   Implement your changes locally. Make sure to:  
   * Follow the Style Guide.  
   * Add comments explaining your code if it’s complex.  
   * Run tests (if applicable) before committing.

**Commit Your Changes**  
Once you're happy with the changes, commit them with a meaningful message:  
```bash  
git add .
git commit -m "Add: [short description of your feature/fix]"
```

4. **Push to GitHub**  
   Push your changes to your forked repository:  
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Submit a Pull Request**  
   * Go to the original repository and open a new Pull Request (PR).  
   * Provide a detailed description of your changes and link any relevant issues.  
   * Ensure that your PR passes all automated checks (if applicable).  
6. **Review Process**  
   * Your PR will be reviewed by maintainers or mentors.  
   * You may be asked to make additional changes based on feedback.  
   * Once everything looks good, your PR will be merged\!

## **Development Setup**

### **Prerequisites**

Ensure you have the following installed:

* **Git**  
* **Node.js**
* **You also need to have mongodb cluster url and sendgrid api and password**

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

2. Add .env in the root directory. Here's an example env file for you.

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


4. You’re all set to start contributing\!

## **Style Guide**

To ensure consistency across contributions, please follow these guidelines:

* **Code Formatting:** Follow [Prettier](https://prettier.io/) or another style guide that’s being used.  
* **Naming Conventions:** Use clear, descriptive variable and function names.  
* **Commit Messages:** Write clear commit messages that describe the changes (e.g., `Fix: Resolve issue with cart updates`).

