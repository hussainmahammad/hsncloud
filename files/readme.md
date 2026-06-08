<img width="1536" height="1024" alt="ChatGPT Image Jun 8, 2026, 10_53_53 AM" src="https://github.com/user-attachments/assets/1e7c9d70-64c4-49ab-be2f-70f45b68a2ae" />

## Project Overview

HSNCloud is a cloud-based file storage and management platform inspired by services such as Google Drive.

The platform allows users to securely upload, organize, manage, and access files through a web-based interface while leveraging AWS cloud services for storage, scalability, security, and high availability.

This project demonstrates:

* Full Stack Application Development
* AWS Cloud Architecture Design
* Infrastructure Provisioning using Terraform
* Configuration Management using Ansible
* CI/CD Automation using Jenkins
* Amazon S3 based File Storage
* Amazon CloudFront Content Delivery
* Application Load Balancer Integration
* Amazon RDS Database Management
* Automated Deployment Validation

---

## Infrastructure Architecture

HSNCloud is deployed using a fully automated AWS infrastructure and CI/CD pipeline.

### Frontend Layer

* React application is built through Jenkins
* Static frontend assets are stored in Amazon S3
* Amazon CloudFront is used as the Content Delivery Network (CDN)
* Users access the application through CloudFront

---

### Backend Layer

* Backend APIs are developed using Node.js and Express
* Application runs on Amazon EC2
* Traffic is distributed through an Application Load Balancer (ALB)
* Health checks are performed automatically during deployment

---

### Database Layer

* Amazon RDS (MySQL) stores:

  * User information
  * Authentication data
  * File metadata
  * Application records

---

### Storage Layer

* Amazon S3 is used for secure file storage
* User uploaded files are stored separately from application data
* Cloud storage enables scalability and durability

---

### Email Services

* Amazon SES is used for sending application emails and notifications

---

### CI/CD Pipeline

Deployment is fully automated using Jenkins.

The pipeline performs:

* Source Code Checkout
* Frontend Build
* Infrastructure Provisioning using Terraform
* Server Configuration using Ansible
* Backend Deployment
* Frontend Upload to Amazon S3
* CloudFront Cache Invalidation
* Automated Health Validation

---

## Project Highlights

* Cloud-Native File Storage Platform
* Infrastructure as Code (Terraform)
* Configuration Management (Ansible)
* Continuous Integration & Continuous Deployment (Jenkins)
* AWS CloudFront CDN Integration
* Amazon S3 File Storage
* Amazon RDS Managed Database
* Application Load Balancer Integration
* Automated Deployment Validation
* Production-Oriented AWS Architecture

---

## Purpose

HSNCloud was developed to demonstrate the implementation of a real-world cloud application using AWS and DevOps best practices while providing secure file storage and management capabilities similar to modern cloud drive platforms.
