import axios, { AxiosInstance } from "axios";

export interface AxiosInstanceForBe extends AxiosInstance {}

export const createInstanceForBe = (token: string): AxiosInstanceForBe => {
    return axios.create({
        baseURL: 'https://7fac-2409-8938-c88-2955-4541-68be-4e48-a266.ngrok-free.app/api',
        headers: {
            Authorization: token,
            'User-Agent': 'Team-Duiduidui: Genius Rank',
        }
    });
}