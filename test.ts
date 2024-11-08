const fs = require("fs");
try {
  const res = await fetch(
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/40.7128,-74.0060/2008-10-24T18:30:00.000Z?key=FXS6RWWQU94CS3Z23ZVCUMRAG"
  );

  const b = await res.json();
  fs.writeFileSync("weather.json", JSON.stringify(b));
  console.log(b);
} catch (error) {
  console.error(error);
}

/*
try {
  // message: "dt or end_dt parameter should be in yyyy-MM-dd format and on or after 1st Jan, 2010 (2010-01-01).",

  const d = "2024-10-22T18:30:00.000Z";
  const da = d.split("T")[0];
  console.log(da);
  const url = `http://api.weatherapi.com/v1/history.json?key=2bb600e880244987859110135241910&q=26.7916566,74.02606639999999&dt=${da}`;
  console.log(url);

  const weather = await fetch(
    `http://api.weatherapi.com/v1/history.json?key=2bb600e880244987859110135241910&q=26.7916566,74.02606639999999&dt=${da}`
  );
  const Weather_data = await weather.json();
  console.log(Weather_data);
} catch (error) {
  console.error("here", error);
}
**/
// const aa = [
//   {
//     "_creationTime": 1729593227804.1628,
//     "_id": "kh7ds2n5e0346vj1hh83rby3zn735s14",
//     "city": "Edgar",
//     "county": "United States",
//     "createdBy": "jd73hg643xwagbkyakcb58qa05730wfp",
//     "date": "2024-10-21T18:30:00.000Z",
//     "latitude": 40.3367168,
//     "locationDescription": "83P6+MP Edgar, NE, USA",
//     "locationName": "Unnamed Location",
//     "longitude": -97.93813209999999,
//     "sessions": [
//       {
//         "hunters": [
//           {
//             "duckBlind": {
//               "latitude": 40.3367168,
//               "longitude": -97.93813209999999,
//               "name": "1B"
//             },
//             "email": "aniproductmail@gmail.com",
//             "firstName": "ani",
//             "fullName": "ani ",
//             "harvests": [
//               {
//                 "quantity": 2,
//                 "speciesId": "k97drsvknerf6m64jq6rrjpzk5730bm9",
//                 "speciesName": "Gadwall"
//               },
//               {
//                 "quantity": 1,
//                 "speciesId": "k973v2qv6yagdwf0xzg4c3apw573091s",
//                 "speciesName": "American Wigeon"
//               }
//             ],
//             "id": "jd73hg643xwagbkyakcb58qa05730wfp",
//             "lastName": "user without last name",
//             "memberShipType": "guest",
//             "phoneNumber": "+919057963115",
//             "pictureUrl": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybmhrY01CMWFmNHdnc0RyY2RoY2d0SkxTZlEifQ"
//           }
//         ],
//         "pictures": [
//           "kg24ty0kn897pxwargcyy6hy1h734r1p"
//         ],
//         "timeSlot": "mid-day",
//         "totalWaterfowl": 3,
//         "weather": {
//           "condition": "Sunny",
//           "dt": "2024-10-22 12:00",
//           "humidity": 49,
//           "precipitation": 0,
//           "source": "weatherapi.com",
//           "temperatureC": 23.3,
//           "uvIndex": 6,
//           "visibility": 10,
//           "windDirection": "WNW",
//           "windSpeed": 18
//         }
//       },
//       {
//         "hunters": [
//           {
//             "duckBlind": {
//               "latitude": 40.3367168,
//               "longitude": -97.93813209999999,
//               "name": "1B"
//             },
//             "email": "anujzzztw@gmail.com",
//             "firstName": "Anuj Singh",
//             "fullName": "Anuj Singh Phanan",
//             "harvests": [
//               {
//                 "quantity": 2,
//                 "speciesId": "k97drsvknerf6m64jq6rrjpzk5730bm9",
//                 "speciesName": "Gadwall"
//               }
//             ],
//             "id": "jd75pztjmkk7pqyg1wmwf04jcs72ydcj",
//             "lastName": "Phanan",
//             "memberShipType": "guest",
//             "phoneNumber": "+918619443170",
//             "pictureUrl": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybmVZR3E1dWp6TE80c1ljZ0NldlpES1B5S3kifQ"
//           },
//           {
//             "duckBlind": {
//               "latitude": 40.3367168,
//               "longitude": -97.93813209999999,
//               "name": "Pit"
//             },
//             "email": "aniproductmail@gmail.com",
//             "firstName": "ani",
//             "fullName": "ani ",
//             "harvests": [
//               {
//                 "quantity": 2,
//                 "speciesId": "k9707ks6qy2vjhzjktta82qhd1731v9z",
//                 "speciesName": "Blue-winged Teal"
//               },
//               {
//                 "quantity": 1,
//                 "speciesId": "k973v2qv6yagdwf0xzg4c3apw573091s",
//                 "speciesName": "American Wigeon"
//               }
//             ],
//             "id": "jd73hg643xwagbkyakcb58qa05730wfp",
//             "lastName": "user without last name",
//             "memberShipType": "guest",
//             "phoneNumber": "+919057963115",
//             "pictureUrl": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybmhrY01CMWFmNHdnc0RyY2RoY2d0SkxTZlEifQ"
//           }
//         ],
//         "pictures": [
//           "kg22m95ktcpev85ktk2tywaem97342c1"
//         ],
//         "timeSlot": "afternoon",
//         "totalWaterfowl": 5,
//         "weather": {
//           "condition": "Sunny",
//           "dt": "2024-10-22 17:00",
//           "humidity": 31,
//           "precipitation": 0,
//           "source": "weatherapi.com",
//           "temperatureC": 27.3,
//           "uvIndex": 7,
//           "visibility": 10,
//           "windDirection": "WNW",
//           "windSpeed": 14
//         }
//       },
//       {
//         "hunters": [
//           {
//             "duckBlind": {
//               "latitude": 40.3367168,
//               "longitude": -97.93813209999999,
//               "name": "1A"
//             },
//             "email": "anujzzztw@gmail.com",
//             "firstName": "Anuj Singh",
//             "fullName": "Anuj Singh Phanan",
//             "harvests": [
//               {
//                 "quantity": 1,
//                 "speciesId": "k973v2qv6yagdwf0xzg4c3apw573091s",
//                 "speciesName": "American Wigeon"
//               }
//             ],
//             "id": "jd75pztjmkk7pqyg1wmwf04jcs72ydcj",
//             "lastName": "Phanan",
//             "memberShipType": "guest",
//             "phoneNumber": "+918619443170",
//             "pictureUrl": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybmVZR3E1dWp6TE80c1ljZ0NldlpES1B5S3kifQ"
//           }
//         ],
//         "timeSlot": "morning",
//         "totalWaterfowl": 1,
//         "weather": {
//           "condition": "Clear",
//           "dt": "2024-10-21 07:00",
//           "humidity": 60,
//           "precipitation": 0,
//           "source": "weatherapi.com",
//           "temperatureC": 13.9,
//           "uvIndex": 0,
//           "visibility": 10,
//           "windDirection": "S",
//           "windSpeed": 18.7
//         }
//       }
//     ],
//     "state": "Nebraska",
//     "updatedAt": "2024-10-22T11:37:08.544Z"
//   },
//   {
//     "_creationTime": 1729595549595.6587,
//     "_id": "kh7dn5276whwvjnbv9g4a56dfh7355v1",
//     "city": "Kekri",
//     "county": "India",
//     "createdBy": "jd73hg643xwagbkyakcb58qa05730wfp",
//     "date": "2024-10-20T18:30:00.000Z",
//     "latitude": 25.9812135,
//     "locationDescription": "RJ SH 12, Kekri, Rajasthan 305404, India",
//     "locationName": "Kekri Bypass",
//     "longitude": 75.17007679999999,
//     "sessions": [
//       {
//         "hunters": [
//           {
//             "duckBlind": {
//               "latitude": 25.9812135,
//               "longitude": 75.17007679999999,
//               "name": "1B"
//             },
//             "email": "aniproductmail@gmail.com",
//             "firstName": "ani",
//             "fullName": "ani ",
//             "harvests": [
//               {
//                 "quantity": 2,
//                 "speciesId": "k97bbhfq3sn2yvjxppvvysqv2h731yc8",
//                 "speciesName": "Northern Pintail"
//               },
//               {
//                 "quantity": 3,
//                 "speciesId": "k971gav7r7zpx7j6rvgm61tamn7300nn",
//                 "speciesName": "Mallard"
//               }
//             ],
//             "id": "jd73hg643xwagbkyakcb58qa05730wfp",
//             "lastName": "user without last name",
//             "memberShipType": "guest",
//             "phoneNumber": "+919057963115",
//             "pictureUrl": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybmhrY01CMWFmNHdnc0RyY2RoY2d0SkxTZlEifQ"
//           }
//         ],
//         "timeSlot": "morning",
//         "totalWaterfowl": 5,
//         "weather": {
//           "condition": "Sunny",
//           "dt": "2024-10-20 07:00",
//           "humidity": 53,
//           "precipitation": 0,
//           "source": "weatherapi.com",
//           "temperatureC": 25,
//           "uvIndex": 6,
//           "visibility": 10,
//           "windDirection": "W",
//           "windSpeed": 11.9
//         }
//       },
//       {
//         "hunters": [
//           {
//             "duckBlind": {
//               "latitude": 25.9812135,
//               "longitude": 75.17007679999999,
//               "name": "1B"
//             },
//             "email": "anujzzztw@gmail.com",
//             "firstName": "Anuj Singh",
//             "fullName": "Anuj Singh Phanan",
//             "harvests": [
//               {
//                 "quantity": 1,
//                 "speciesId": "k97fanyhwjkcwhtk2eaqmkr3ah730fd6",
//                 "speciesName": "Greater White-fronted Goose"
//               }
//             ],
//             "id": "jd75pztjmkk7pqyg1wmwf04jcs72ydcj",
//             "lastName": "Phanan",
//             "memberShipType": "guest",
//             "phoneNumber": "+918619443170",
//             "pictureUrl": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybmVZR3E1dWp6TE80c1ljZ0NldlpES1B5S3kifQ"
//           }
//         ],
//         "timeSlot": "afternoon",
//         "totalWaterfowl": 1,
//         "weather": {
//           "condition": "Sunny",
//           "dt": "2024-10-20 17:00",
//           "humidity": 31,
//           "precipitation": 0,
//           "source": "weatherapi.com",
//           "temperatureC": 31.3,
//           "uvIndex": 8,
//           "visibility": 10,
//           "windDirection": "WNW",
//           "windSpeed": 6.5
//         }
//       }
//     ],
//     "state": "Rajasthan",
//     "updatedAt": "2024-10-22T11:13:13.865Z"
//   }
// ]

// console.log(aa)
