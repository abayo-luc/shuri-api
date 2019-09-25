# Shuri-API

[![pipeline status](https://gitlab.com/shuri-dev/shuri-api/badges/develop/pipeline.svg)](https://gitlab.com/shuri-dev/shuri-api/commits/develop)
[![coverage report](https://gitlab.com/shuri-dev/shuri-api/badges/develop/coverage.svg)](https://gitlab.com/shuri-dev/shuri-api/commits/develop)

## Code style

The style-guide is ESlint-airbnb, and it uses prettier for frommating code. To enable `VS Code + ESLint + prettier` follow the steps below:

- Text editor [VSCode](https://code.visualstudio.com)
- In VS Code, `Ctrl + Shift + X`
- Search and install _ESLint_
- Search and install _Prettier Code Formatter_
- Restart VS Code.

### Getting Started

### Clone the latest version of the repository

`https://gitlab.com/shuri-dev/shuri-api.git` or `git@gitlab.com:shuri-dev/shuri-api.git`

### Change directory

`cd into the project directory`

### Update the environment variables in sample.env file and rename it to '.env'

`cp sample.env ./.env`

### Install the project's dependencies with

`yarn` or `npm install`

### Make sure to have the postgres database created for the project

After setting up the database,

- Install the `Sequelize CLI` ==> `https://www.npmjs.com/package/sequelize-cli`
- Run the database migrations with the `db:migrate` command found in `package.json`

### Testing CI/CD

`yarn test` or `npm run test`

### Start the application

`yarn start` or `yarn run dev`

## API Spec

The preferred JSON object to be returned by the API should be structured as follows:

### Admin Endpoints

Create new admin
`POST /admins`

```source-json
    {
        "email":"me@example.com",
        "password":"password"
    }
```

Sample response body:

```source-json
{
    "message": "Success",
    "data": {
        "id": "43ebe85f-8f61-49f2-b438-866d2ef9e983",
        "email": "me@example.com",
        "updatedAt": "2019-09-09T10:21:12.703Z",
        "createdAt": "2019-09-09T10:21:12.703Z",
        "type": "accountant"
    }
}
```

Get all admins `GET /admins`

```source-json
{
    "message": "Success",
    "data": [
        {
            "id": "43ebe85f-8f61-49f2-b438-866d2ef9e983",
            "email": "me@example.com",
            "type": "accountant",
            "createdAt": "2019-09-09T10:21:12.703Z",
            "updatedAt": "2019-09-09T10:21:12.703Z"
        }
    ]
}
```

Get admins by ID `GET /admins/:id`

```source-json
{
    "message": "Success",
    "data": {
        "id": "43ebe85f-8f61-49f2-b438-866d2ef9e983",
        "email": "luc.bayo@gmail.com",
        "type": "accountant",
        "createdAt": "2019-09-09T10:21:12.703Z",
        "updatedAt": "2019-09-09T10:21:12.703Z"
    }
}
```

### User Authentication Endpoints

Admins authentication `POST /admins/auth`
Bus company authentication `POST /companies/auth`
School users authentication `POST /school-users/auth`

```source-json
{
    "email":"me@example.com",
    "password":"password"
}
```

sample response body:

```source-json
{
    "message": "Success",
    "token": "jwt-token-on-success"
}
```

Get current user `GET /current`

```source-json
{
    "message": "Success",
    "data": {
        "id": "36e46bea-3f99-44ee-a610-23e7a997a641",
        "email": "me@example.com",
        "type": "general",
        "createdAt": "2019-09-02T20:36:56.504Z",
        "updatedAt": "2019-09-02T20:36:56.504Z"
    }
}
```

### Bus Company Endpoint

Get all companies `GET /companies`
Sample response

```source-json
{
    "message": "Success",
    "data": {
        "companies": [
            {
                "id": "063d3a6d-8e18-4686-8939-38dbd18162c5",
                "name": "company1",
                "email": "company1@example.com",
                "country": "Rwanda",
                "district": "Gasabo",
                "createdAt": "2019-09-05T12:41:25.002Z",
                "updatedAt": "2019-09-05T12:41:25.002Z"
            },
        ]
    }
}
```

Create new busy company `POST /companies`
Sample request post

```source-json
{
	"name":"Company 1",
	"email":"company@example.com",
    "country":"Rwanda",
    "district":"Nyarugenge",
    "phoneNumber":"456789",
    "password":"password",
    "description":"Hello world"
}
```

Sample response body

```source-json
{
    "message": "Success",
    "data": {
        "id": "2a108be6-6435-4ac3-a968-247260d9b0d9",
        "name": "Company 1",
        "email": "company@example.com",
        "country": "Rwanda",
        "district": "Nyarugenge",
        "updatedAt": "2019-09-09T10:39:42.859Z",
        "createdAt": "2019-09-09T10:39:42.859Z",
        "phoneNumber": null,
        "description": null
    }
}
```

Get company by ID `GET /companies/:id`
<br/>
<br/>
Update company `PUT /companies/:id`
<br/>
<br/>
Get all company partners `GET /companies/:id/partners`
<br/>
<br/>
Approve partnership `PUT /partners/:schoolId/approve`
<br/>
<br/>
Reject partnership `PUT /partners/:schoolId/reject`
<br/>
<br/>

Delete company `DELETE /companies/:id`

### School Endpoints

Add a new school school `POST /schools`

```source-json
{
    "name":"School 1",
    "email":"school@example.com",
    "phoneNumber":"0789277275",
    "password":"password",
    "longitude":"-56788765",
    "province":"Kigali",
    "sector":"Kimironko",
    "cell":"Bibare",
    "latitude":"+678987",
    "district":"Gasabo",
    "country":"Rwanda"
}
```

Get all schools `GET /schools`
Get school by id `GET /schools/:id`
Update school `PUT /schools/:id`
Delete school `DELETE /schools/:id`
