import http from 'k6/http';
import { check, sleep } from 'k6';


function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateRandomName() {
    const length = Math.floor(Math.random() * 4) + 3; // Generate a length between 3 and 6
    return generateRandomString(length);
}

function generateRandomEmail() {
    const randomName = generateRandomString(Math.floor(Math.random() * 6) + 3); // Random name length between 3 to 6
    const domain = generateRandomString(5) + '.com'; // Random domain of 5 letters
    return `${randomName}@${domain}`;
}

function generateRandomMobile() {
    const mobile = '1' + Math.floor(Math.random() * 1000000000); // Ensure it starts with a 1, and generate 9 more digits
    return mobile.padStart(10, '0'); // Ensure the mobile number is exactly 10 digits
}
export const options = {
    vus: 800,
    duration: '30s',
    thresholds: {
        http_req_failed: ['rate<0.03'], // http errors should be less than 1%
        http_req_duration: ['p(90)<150'], // 95% of requests should be below 200ms
    },

    // stages: [
    //     { duration: '45s', target: 300 }, // fast ramp-up to a high point
    //     // No plateau
    //     { duration: '30s', target: 0 }, // quick ramp-down to 0 users
    // ],
};

export default function () {
    // Replace with your actual JWT token
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6IlN3YXJuYWxpIiwiZW1haWwiOiJzd2FybmFsaUBnbWFpbC5jb20iLCJpYXQiOjE3MzUzNzI5OTksImV4cCI6MTczNTM3NjU5OX0.wj4swwy-NBio3PK2V3S-hfAQByi1cTMmngr3D4mIgXM";
    // const url = 'http://host.docker.internal:5000/api/contacts';
    const url2 = 'http://host.docker.internal:5000/api/contacts/addContact';
    http.post(url2, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: generateRandomName(),
            email: generateRandomEmail(),
            mobile: generateRandomMobile(),
        }),
    })
    // const res2 = http.post(url2, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({
    //         name: generateRandomName(),
    //         email: generateRandomEmail(),
    //         mobile: generateRandomMobile(),
    //     }),
    // })
    // GET request
    // const res = http.get(url, {
    //     headers: { Authorization: `Bearer ${token}` },
    // });

    // Validate response
    // check(res, {
    //     'status is 200': (r) => r.status === 200,
    //     'response is not empty': (r) => r.body && r.body.length > 0,
    // });
    // check(res2, {
    //     'status is 200': (r) => r.status === 200,
    //     'response is not empty': (r) => r.body && r.body.length > 0,
    // })
    sleep(1);
}
