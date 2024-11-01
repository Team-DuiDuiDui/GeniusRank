import { AxiosInstance } from 'axios';
import { User, UserData } from './typings/user';
import { createInstanceForGithub } from '../instance';

export class gqlUser {
    public name: string;
    private axiosInstance: AxiosInstance;
    public data: User | null = null;

    constructor(name: string, token: string) {
        this.name = name;
        this.axiosInstance = createInstanceForGithub(token, undefined, undefined, 'Bearer');
    }

    async getData(count: number = 5): Promise<UserData> {
        return await this.axiosInstance.post('/graphql', {
            query: `
query($username:String!,$count:Int!){
    user(login: $username){
        avatarUrl
        name
        login
        bio
        followers{
            totalCount
        }
        following{
            totalCount
        }
        location
        company
        twitterUsername
        lifetimeReceivedSponsorshipValues{
            totalCount
        }
        pullRequests(last:$count){
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
                createdAt
            }
            totalCount
        }
        issues(last:$count){
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
                createdAt
            }
            totalCount
        }
        repositories(last:$count,orderBy:{direction:ASC,field:STARGAZERS}){
            nodes{
                url
                isFork
                stargazerCount
                forkCount
                issues{
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
}`,
            variables: { username: this.name, count: count },
        });
    }
}
