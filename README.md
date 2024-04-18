# Northcoders News API

Hosted Version: "https://nc-news-s5ln.onrender.com/"

## Summary

This express app provides a web api for accessing the NC_news database. It includes all of the endpoints found in the 'endpoints.json' file.

## Setup

Clone the projext repo from github at:https://github.com/GarudaZ/nc-news

All dependencies can be installed using 'npm install' from within the project folder, package details are below.

### ENV Files

In order to run the project locally, create two files for the databases environment variables: '.env.test' and '.env.development'.
These files should follow the format shown in '.env-example'; 'PGDATABASE=' followed the database names found in 'setup.sql', one name in each matching env file.

## Requirements

Minimum Versions:
Node.js - 27.2.5
Postgres - 8.11.5

### Dependencies

    	dotenv: 16.4.5,
    	express: 4.19.2,
    	pg: 8.11.5,
    	pg-format: 1.0.4

    Developer:
    	husky: 8.0.2,
    	jest: 27.5.1",
    	jest-extended: 2.0.0,
    	jest-sorted: 1.0.15,
    	supertest: 6.3.4

### Testing

Tests can be run using the script: 'npm test'. There are separate test files for the app and the utilites.

### Seeding

Seeding will take place automatically during testing. Use the 'seed' script to seed the development database.
