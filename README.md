# Image AI App Frontend

Angular frontend for a full-stack AI-powered image application, deployed on **AWS S3 + CloudFront**.

## Overview

This frontend provides the user-facing interface for the Image AI application.  
It is built with **Angular** and designed to work with a Spring Boot backend hosted on **AWS ECS Fargate**.

The app was deployed as a static frontend using:

- **Amazon S3** for hosting build assets
- **Amazon CloudFront** for CDN delivery
- Angular production build output for optimized static deployment

## Tech Stack

- Angular
- TypeScript
- HTML / CSS
- AWS S3
- AWS CloudFront

## Key Features

- User-friendly frontend for the Image AI application
- Registration and login flows
- API integration with backend services
- Static frontend deployment through CloudFront CDN
- Production-ready Angular build setup

## Deployment

The frontend is deployed using:

- **S3** to store the Angular production build files
- **CloudFront** to serve the frontend globally over HTTPS

### Deployment Flow

1. Build Angular app
2. Upload build output to S3
3. Serve via CloudFront
4. Configure SPA routing with `index.html`

## Build Command

```bash
npm install
npm run build
```

Production build output is generated under:

```bash
dist/image-ai-app/browser
```

## Local Development

```bash
npm install
npm start
```

The app runs locally on Angular dev server.

## Project Structure

```bash
src/
├── app/
├── assets/
├── environments/
├── styles.css
├── main.ts
```

## AWS Architecture

This frontend is part of a larger AWS deployment:

- **Frontend:** Angular on S3 + CloudFront
- **Backend:** Spring Boot on ECS Fargate
- **Database:** PostgreSQL on RDS
- **Container Registry:** Amazon ECR

## Notes

The frontend currently communicates with the deployed backend API.  
A further enhancement is to route backend API calls through a stable ALB-based path for a single-domain production setup.

## Screenshots

Add screenshots here:

- Home page
- Login page
- Register page
- CloudFront deployment screenshot

## What I Learned

This project helped me gain hands-on experience with:

- Angular production builds
- Static frontend deployment on AWS
- CloudFront distribution setup
- SPA routing configuration for static hosting
- Integrating frontend and backend in a cloud environment

## Future Improvements

- Stable backend API routing through ALB
- Custom domain configuration
- HTTPS end-to-end backend integration
- CI/CD pipeline for automated deployments

## Author

Kavya M

