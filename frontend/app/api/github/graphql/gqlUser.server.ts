import { AxiosInstance } from 'axios';
import { UserDetail, UserData } from './typings/user';
import { createInstanceForGithub } from '../instance';
import { handleBackendReq } from '../../../utils/request';
import { createInstanceForBe } from '~/api/backend/instance';
import { GithubScoreRes } from '~/api/backend/typings/beRes';

export class gqlUser {
    public name: string;
    private githubInstance: AxiosInstance;
    private beInstance: AxiosInstance;
    public dataDetail: UserDetail | null = null;

    constructor(name: string, token: string, baseUrl: string, beToken: string, githubInstance?: AxiosInstance) {
        this.name = name;
        this.githubInstance = githubInstance
            ? githubInstance
            : createInstanceForGithub(token, 'Team-Duiduidui: Genius Rank', 'Bearer');
        this.beInstance = createInstanceForBe(baseUrl, beToken);
    }

    async getData(count: number = 50): Promise<UserData> {
        const query = `
        query($username:String!,$count:Int!){
            user(login: $username){
                avatarUrl
                databaseId
                name
                login
                bio
                followers(last: 80) {
                    nodes {
                        login
                        name
                        location
                        company
                        followers {
                            totalCount
                            }
                        following {
                            totalCount
                            }
                        }
                    totalCount
                }
                following(last: 80) {
                    nodes {
                        login
                        name
                        location
                        company
                        followers {
                            totalCount
                        }
                    }
                    totalCount 
                }
                location
                company
                twitterUsername
                lifetimeReceivedSponsorshipValues{
                    totalCount
                }
                pullRequests(last:$count,orderBy:{direction:ASC,field:UPDATED_AT}){
                    nodes{
                        title
                        url
                        # CLOSED / MERGED / OPEN
                        state
                        # pr 编号
                        number
                        baseRepository{
                            url
                            isFork
                            stargazerCount
                            forkCount
                            issues{
                                totalCount
                            }
                            pullRequests{
                                totalCount
                            }
                            discussions{
                                totalCount
                            }
                            primaryLanguage{
                                name
                            }
                            watchers{
                                totalCount
                            }
                        }
                        commits{
                            totalCount
                        }
                        totalCommentsCount
                        updatedAt
                    }
                    totalCount
                }
                issues(last:$count,orderBy:{direction:ASC,field:UPDATED_AT}){
                    nodes{
                        title
                        url
                        # CLOSED / OPEN
                        state
                        # issue 编号
                        number
                        repository{
                            url
                            isFork
                            stargazerCount
                            forkCount
                            issues{
                                totalCount
                            }
                            pullRequests{
                                totalCount
                            }
                            discussions{
                                totalCount
                            }
                            primaryLanguage{
                                name
                            }
                            watchers{
                                totalCount
                            }
                        }
                        comments{
                            totalCount
                        }
                        updatedAt
                    }
                    totalCount
                }
                repositories(last:$count,orderBy:{direction:ASC,field:STARGAZERS},ownerAffiliations:[OWNER]){
                    nodes{
                        url
                        isFork
                        stargazerCount
                        forkCount
                        issues{
                            totalCount
                        }
                        pullRequests{
                                totalCount
                            }
                        discussions{
                            totalCount
                        }
                        primaryLanguage{
                            name
                        }
                        watchers{
                            totalCount
                        }
                    }
                    totalCount
                }
                repositoriesContributedTo(last:$count,orderBy:{direction:ASC,field:STARGAZERS},contributionTypes:[PULL_REQUEST,COMMIT,REPOSITORY]){
                    nodes{
                        url
                        isFork
                        stargazerCount
                        forkCount
                        issues{
                            totalCount
                        }
                        pullRequests{
                                totalCount
                            }
                        discussions{
                            totalCount
                        }
                        primaryLanguage{
                            name
                        }
                        watchers{
                            totalCount
                        }
                    }
                    totalCount
                }
            }
            user(login: $username) {
            repository(name: $username) {
                    defaultBranchRef {
                        name
                    }
                }
            }
        }
        `
        try {
            const res = await this.githubInstance.post('/graphql', {
                query
                ,
                variables: { username: this.name, count: count },
            });
            this.dataDetail = res.data.data.user;
            return res.data;
        } catch (e) {
            const res = await this.githubInstance.post('/graphql', {
                query
                ,
                variables: { username: this.name, count: 20 },
            });
            this.dataDetail = res.data.data.user;
            return res.data;
        }
    }

    async getUserScores(): Promise<GithubScoreRes> {
        const data = (await handleBackendReq<GithubScoreRes>(
            () => this.beInstance.post(`/analyze/score/detailed`, this.dataDetail),
            (res) => res.data
        ))!;
        return data;
    }
}
