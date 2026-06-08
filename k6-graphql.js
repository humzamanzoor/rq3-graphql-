import http from 'k6/http';
import { sleep } from 'k6';

const BACKEND = 'http://odroid2:5000';
const PG_HOST = 'http://controller.lan:8080';
const SESSION_ID = __ENV.SESSION_ID;
const IMPLEMENTATION = __ENV.IMPLEMENTATION;

export const options = {
    vus: 30,
    duration: '30s',
};

export function setup() {
    http.get(`${PG_HOST}/api/v2/session/${SESSION_ID}/measurement/start/CLIENT/${IMPLEMENTATION}`);
    http.get(`${PG_HOST}/api/v2/session/${SESSION_ID}/run/start/CLIENT/1`);
}

export default function () {
    const payload = JSON.stringify({
        query: `query GetUser($id: Int!, $posts: Int!, $comments: Int!) {
            user(id: $id, posts: $posts, comments: $comments) {
                id username email createdAt
                posts { id title body createdAt
                    comments { id author body createdAt }
                }
            }
        }`,
        variables: { id: 1, posts: 10, comments: 10 }
    });
    http.post(`${BACKEND}/graphql`, payload, {
        headers: { 'Content-Type': 'application/json' }
    });
    sleep(1);
}

export function teardown() {
    http.get(`${PG_HOST}/api/v2/session/${SESSION_ID}/run/stop/CLIENT/1`);
    http.get(`${PG_HOST}/api/v2/session/${SESSION_ID}/measurement/stop/CLIENT/${IMPLEMENTATION}`);
}