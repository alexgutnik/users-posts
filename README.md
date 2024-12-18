# Sweetch Home assignment

## Introduction
This is a home assignment for Sweetch.

The goal is to implement an API that will allow to:
- Get list of users
- Get user by id
- Get list of posts by user id

## Requirements
- Nodejs (v20.0.0)
- Good vibes

## Installation
- Clone the repository
- Run `npm install`

## Running the server
- Run `npm run start:all`
- The users service will run on port 5001
- The posts service will run on port 5002

- To run the services separately:
  - Run `npm run start:users`
  - Run `npm run start:posts`

## Running the tests
- Run `npm run test:all`

## API
- `GET localhost:5001/users` to get all users
- `GET localhost:5001/users/:id` to get user by id
- `GET localhost:5002/users/:id/posts` to get posts by user id

## Architecture
The project is divided into 3 parts:
- Users service
- Posts service
- Shared library

The shared library contains the shared code between the services.

The services are independent and can be run separately.
Each service is divided into 4 layers:
- Controller (Routes)
- Service
- Repository
- Model

As data source I used the JSONPlaceholder API. Also, I added a support for the DB in case we want to store the data locally.
To change the data source, all we need to do is to implement DB connection and switch the repository implementation (see `user.db.repository.ts` and `user.service.ts`).

## Possible Improvements
- Add more tests for edge cases
- Add more error handling
- Add logging
- Add more validation
- Add more documentation

