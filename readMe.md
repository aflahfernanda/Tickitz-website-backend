<h1 align="center">TICKITZ Backend</h1>

## Contents

- [Link](#link)

- [How It Works](#how-it-works)

- [What To Do](#what-to-do)

- [Remote Database](#remote-database)

- [Endpoint](#endpoint)

## Link

- Link Heroku : https://project-paytickz.herokuapp.com/
- Link Cloudinary : "https://res.cloudinary.com/da776aoko/image/upload/v1656320957/"

## How It Works ?

1. Download Postman Collection [[here](https://drive.google.com/file/d/1NtuQ54laE0NEfXGzNSnziLFf7SW9z1B9/view?usp=sharing)]
2. Open Your Postman App
3. Import Postman Collection
4. Create Environtments in Postman & Set :

```bash
VARIABLE : itjobs
INITIAL VALUE : https://project-paytickz.herokuapp.com/
CURRENT VALUE : https://project-paytickz.herokuapp.com/
```

5. Test Request

## What To Do ?

1. Register using your real information
2. Open your registered email address
3. Open email and follow the instruction to verify your FazzPay account
4. Login and use the API

## Remote Database

```bash
Hostname = ec2-44-202-197-206.compute-1.amazonaws.com
Port = 3306
Username = fw6aflah
Password = Psujy82!
```

note: don't drop or remove table and database

## EndPoint

### Module User Auth

**Used for user authentication**

| No. | Method | Endpoint             | Information                      |
| --- | ------ | -------------------- | -------------------------------- |
| 1.  | POST   | /auth/register       | Used for register new user.      |
| 2.  |        | /auth/login          | Used for login into app.         |
| 3.  |        | /auth/forgotPassword | Used for forgot password.        |
| 4.  |        | /auth/logout         | Used for logout from system.     |
| 5.  | GET    | /auth/verify/:key    | Used for activating new account. |
| 6.  | PATCH  | /auth/resetPassword  | Used for reseting password.      |

### Module User

**Used for any company feature**

| No. | Method | Endpoint               | Information                                                |
| --- | ------ | ---------------------- | ---------------------------------------------------------- |
| 1.  | GET    | /user/:userId          | Used for get user by id                                    |
| 2.  | PATCH  | /user/password/:userId | Used to change password for user.                          |
| 3.  |        | /user/profile/:userId  | Used to change any info for example name and phone number. |
| 4.  |        | /user/image/:userId    | Used to change profile picture for user.                   |
| 5.  | DEL    | /user/image/:userId    | Used to delete profile picture for user.                   |

### Module Movie

**Used for get and search movie**

| No. | Method | Endpoint              | Information              |
| --- | ------ | --------------------- | ------------------------ |
| 1.  | GET    | /movie?page=&limit=   | Used for get all movie   |
|     |        | &sort=&searchRelease= |                          |
|     |        | &searchName=          |                          |
| 2.  |        | /movie/:movieId       | Used for get movie by id |
| 3.  | POST   | /movie                | Used for create movie    |
| 3.  | PATCH  | /movie/:movieId       | Used for udpate movie    |
| 4.  | DEL    | /movie/:movieId       | Used to delete movie     |

### Module Schedule

**Used for get and search schedule**

| No. | Method | Endpoint               | Information                 |
| --- | ------ | ---------------------- | --------------------------- |
| 1.  | GET    | /schedule?page=&limit= | Used for get all schedule   |
|     |        | &sort=&searchRelease=  |                             |
|     |        | &searchLocation=       |                             |
| 2.  |        | /schedule/:scheduleId  | Used for get schedule by id |
| 3.  | POST   | /schedule              | Used for create schedule    |
| 3.  | PATCH  | /schedule/:scheduleId  | Used for udpate schedule    |
| 4.  | DEL    | /schedule/:scheduleId  | Used to delete schedule     |

### Module Booking

**Used for get and search user experience**

| No. | Method | Endpoint            | Information                     |
| --- | ------ | ------------------- | ------------------------------- |
| 1.  | GET    | /booking/:bookingId | Used for get id booking         |
| 2.  |        | /booking/:userId    | Used for get booking by user id |
| 3.  |        | booking?scheduleId= | Used for get seat booking       |
|     |        | &dateBooking=&      |                                 |
|     |        | timeBooking=        |                                 |
| 4.  |        | booking/dashboard   | Used for get dashboard booking  |
|     |        | ?premiere=hiflix&   |                                 |
|     |        | movieId=&location=  |                                 |
| 5.  | POST   | /booking            | Used to create booking          |
| 3.  | PATCH  | /booking/:userId    | Used for udpate status booking  |

### JSON Format

The JSON format of the status pages can be often preferable, for example when the tooling or integration to other systems is easier to achieve via a common data format.

The status values follow the same format as described above - OK, and ERROR Message.

The equivalent to the status key form the plain format is a status key in the root JSON object. Subsystems should use nested objects also having a mandatory status key. Here are some examples:

**succes result**

```
{
    "status": 200,
    "msg": "succes get data",
    "data": [
        {
            "id": 1,
            "name": "Avengers Endgame",
            "category": "action,scifi,adventure",
            "image": "Tickitz/movie/nyyve4ebipovruzeiwev.jpeg",
            "releaseDate": "2022-01-17T00:00:00.000Z",
            "cast": "robert downey jr, chris evans, scarlet johansson, mark ruffalo, chris hemsworth",
            "director": "anthony russo,joe russo",
            "duration": "3 h 1m",
            "synopsis": "Adrift in space with no food or water, Tony Stark sends a message to Pepper
                        Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor,
                        Black Widow, Captain America and Bruce Banner -- must figure out a way to bring back their
                        vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet
                        and the universe.",
            "createdAt": "2022-03-23T09:46:43.000Z",
            "UpdatedAt": "2022-05-17T07:16:40.000Z"
        }
    ],
    "pagination": {
        "dataSearchFound": 1,
        "page": 1,
        "totalPage": 1,
        "limit": 10,
        "totalData": 1
    }
}

```

**data null result**

```

{
    "status": 200,
    "msg": "succes get data",
    "data": [],
    "pagination": {
        "dataSearchFound": 0,
        "page": 1,
        "totalPage": 0,
        "limit": 10,
        "totalData": 0
    }
}

```

**error request result**

```
{
    "status": 404,
    "msg": "Data by id 2 not found",
    "data": null
}
```

## Contributors

If you have a suggestion that would make this better, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

## Contact

Instagram - [@aflahfernanda](https://www.instagram.com/aflahfernanda/)
linkedIn - [@aflahfernanda](https://www.linkedin.com/in/aflah-fernanda-6841401ab/)
email-[fernandaaflah@gmail.com](fernandaaflah@gmail.com)

Project Link: [https://github.com/aflahfernanda](https://github.com/aflahfernanda)

## License

© [Mohd.Aflah Fernanda](https://github.com/aflahfernanda)
