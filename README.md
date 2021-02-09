# Google Cloud Vision API - Object Detection

## Name

vision-web-app

## Description

This is a simple project that demonstrates the usage of Next.js with TypeScript, GrommetJS, FireBase Auth that provides object detection based on image file uploaded by user.

Separately, it is powered by a backend application called vision-backend-app that is powered by NodeJS, ExpressJS, AWS Lambda, Serverless Framework, and Google Vision API.

## Running

### Local

    npm run dev

## Deployment

### Automated

Currently CI/CD pipeline is deployed using AWS CodePipeline and AWS CodeBuild, deployment is performed during the build stage.

## Screenshots

![Landing Page](assets/screenshot_1.png?raw=true "Title")

![Detection](assets/screenshot_2.png?raw=true "Title")

# Notes

- Wanted to perform the drawing of bounding boxes in front end (Static Site using NextJS for SSG) but couldn't do it due to Sharp library dependency on fs, which is only available in NodeJS.
- Still requires some refactoring and code clean up.
