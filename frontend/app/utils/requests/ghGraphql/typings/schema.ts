import { z } from 'zod';

const repositorySchema = z.object({
    url: z.string(),
    isFork: z.boolean(),
    stargazerCount: z.number(),
    forkCount: z.number(),
    issues: z
        .object({
            totalCount: z.number(),
        })
        .nullable(),
    discussions: z
        .object({
            totalCount: z.number(),
        })
        .nullable(),
    primaryLanguage: z
        .object({
            name: z.string(),
        })
        .nullable(),
    watchers: z.object({
        totalCount: z.number(),
    }),
});

const pullRequestSchema = z.object({
    title: z.string(),
    url: z.string(),
    state: z.union([z.literal('CLOSED'), z.literal('MERGED'), z.literal('OPEN')]),
    number: z.number(),
    baseRepository: repositorySchema.nullable(),
    commits: z.object({
        totalCount: z.number(),
    }),
    totalCommentsCount: z.number().nullable(),
    createdAt: z.string(),
});

const issueSchema = z.object({
    title: z.string(),
    url: z.string(),
    state: z.union([z.literal('CLOSED'), z.literal('OPEN')]),
    number: z.number(),
    repository: repositorySchema,
    comments: z.object({
        totalCount: z.number(),
    }),
    createdAt: z.string(),
});

const userSchema = z.object({
    avatarUrl: z.string(),
    name: z.string().nullable(),
    login: z.string(),
    bio: z.string().nullable(),
    followers: z.object({
        totalCount: z.number(),
    }),
    following: z.object({
        totalCount: z.number(),
    }),
    location: z.string().nullable(),
    company: z.string().nullable(),
    twitterUsername: z.string().nullable(),
    lifetimeReceivedSponsorshipValues: z.object({
        totalCount: z.number(),
    }),
    pullRequests: z.object({
        nodes: z.union([z.array(pullRequestSchema), z.tuple([]), z.array(z.null())]),
        totalCount: z.number(),
    }),
    issues: z.object({
        nodes: z.union([z.array(issueSchema), z.tuple([]), z.array(z.null())]),
        totalCount: z.number(),
    }),
    repositories: z.object({
        nodes: z.union([z.array(repositorySchema), z.tuple([]), z.array(z.null())]),
        totalCount: z.number(),
    }),
    repositoriesContributedTo: z.object({
        nodes: z.union([z.array(repositorySchema), z.tuple([]), z.array(z.null())]),
        totalCount: z.number(),
    }),
});

export const userDataSchema = z.object({
    data: z.object({
        user: userSchema,
    }),
});
