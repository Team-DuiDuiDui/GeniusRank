import axios from 'axios';

export const gitReq = axios.create({
    headers: {
        Authorization: `Token ${process.env.GITHUB_ACCESS_TOKEN}`,
    },
});
