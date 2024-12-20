// Generated by ts-to-zod
import { z } from "zod";

export const userSchema = z.object({
  login: z.string(),
  id: z.number(),
  user_view_type: z.string().optional(),
  node_id: z.string(),
  avatar_url: z.string(),
  gravatar_id: z.string().optional().nullable(),
  url: z.string(),
  html_url: z.string(),
  followers_url: z.string(),
  following_url: z.string(),
  gists_url: z.string(),
  starred_url: z.string(),
  subscriptions_url: z.string(),
  organizations_url: z.string(),
  repos_url: z.string(),
  events_url: z.string(),
  received_events_url: z.string(),
  type: z.string(),
  site_admin: z.boolean(),
  name: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  blog: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  notification_email: z.string().optional().nullable(),
  hireable: z.boolean().optional().nullable(),
  bio: z.string().optional().nullable(),
  twitter_username: z.string().optional().nullable(),
  public_repos: z.number(),
  public_gists: z.number(),
  followers: z.number(),
  following: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  plan: z
    .object({
      collaborators: z.number(),
      name: z.string(),
      space: z.number(),
      private_repos: z.number(),
    })
    .optional(),
  private_gists: z.number().optional(),
  total_private_repos: z.number().optional(),
  owned_private_repos: z.number().optional(),
  disk_usage: z.number().optional(),
  collaborators: z.number().optional(),
});

export const userAsFollowerSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string(),
  avatar_url: z.string(),
  gravatar_id: z.string(),
  url: z.string(),
  html_url: z.string(),
  followers_url: z.string(),
  following_url: z.string(),
  gists_url: z.string(),
  starred_url: z.string(),
  subscriptions_url: z.string(),
  organizations_url: z.string(),
  repos_url: z.string(),
  events_url: z.string(),
  received_events_url: z.string(),
  type: z.string(),
  site_admin: z.boolean(),
});

export const userAsFollowerArraySchema = z.array(userAsFollowerSchema);

export const searchResultTextMatchesSchema = z.array(
  z.record(z.unknown()).and(
    z.object({
      object_url: z.string().optional(),
      object_type: z.string().optional().nullable(),
      property: z.string().optional(),
      fragment: z.string().optional(),
      matches: z
        .array(
          z.record(z.unknown()).and(
            z.object({
              text: z.string().optional(),
              indices: z.array(z.number()).optional(),
            }),
          ),
        )
        .optional(),
    }),
  ),
);

export const authorAssociationSchema = z.union([
  z.literal("COLLABORATOR"),
  z.literal("CONTRIBUTOR"),
  z.literal("FIRST_TIMER"),
  z.literal("FIRST_TIME_CONTRIBUTOR"),
  z.literal("MANNEQUIN"),
  z.literal("MEMBER"),
  z.literal("NONE"),
  z.literal("OWNER"),
]);

export const simpleUser5Schema = z.record(z.unknown()).and(
  z.object({
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string(),
    gravatar_id: z.string().nullable(),
    url: z.string(),
    html_url: z.string(),
    followers_url: z.string(),
    following_url: z.string(),
    gists_url: z.string(),
    starred_url: z.string(),
    subscriptions_url: z.string(),
    organizations_url: z.string(),
    repos_url: z.string(),
    events_url: z.string(),
    received_events_url: z.string(),
    type: z.string(),
    site_admin: z.boolean(),
    starred_at: z.string().optional(),
    user_view_type: z.string().optional(),
  }),
);

export const simpleUserSchema = z.record(z.unknown()).and(
  z.object({
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string(),
    gravatar_id: z.string().nullable(),
    url: z.string(),
    html_url: z.string(),
    followers_url: z.string(),
    following_url: z.string(),
    gists_url: z.string(),
    starred_url: z.string(),
    subscriptions_url: z.string(),
    organizations_url: z.string(),
    repos_url: z.string(),
    events_url: z.string(),
    received_events_url: z.string(),
    type: z.string(),
    site_admin: z.boolean(),
    starred_at: z.string().optional(),
    user_view_type: z.string().optional(),
  }),
);

export const simpleUser1Schema = z.record(z.unknown()).and(
  z.object({
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string(),
    gravatar_id: z.string().nullable(),
    url: z.string(),
    html_url: z.string(),
    followers_url: z.string(),
    following_url: z.string(),
    gists_url: z.string(),
    starred_url: z.string(),
    subscriptions_url: z.string(),
    organizations_url: z.string(),
    repos_url: z.string(),
    events_url: z.string(),
    received_events_url: z.string(),
    type: z.string(),
    site_admin: z.boolean(),
    starred_at: z.string().optional(),
    user_view_type: z.string().optional(),
  }),
);

export const simpleUser2Schema = z.record(z.unknown()).and(
  z.object({
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string(),
    gravatar_id: z.string().nullable(),
    url: z.string(),
    html_url: z.string(),
    followers_url: z.string(),
    following_url: z.string(),
    gists_url: z.string(),
    starred_url: z.string(),
    subscriptions_url: z.string(),
    organizations_url: z.string(),
    repos_url: z.string(),
    events_url: z.string(),
    received_events_url: z.string(),
    type: z.string(),
    site_admin: z.boolean(),
    starred_at: z.string().optional(),
    user_view_type: z.string().optional(),
  }),
);

export const gitHubAppSchema = z
  .record(z.unknown())
  .and(
    z.object({
      id: z.number(),
      slug: z.string().optional(),
      node_id: z.string(),
      client_id: z.string().optional(),
      owner: simpleUser5Schema.nullable(),
      name: z.string(),
      description: z.string().nullable(),
      external_url: z.string(),
      html_url: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      permissions: z.record(z.string()).and(
        z.object({
          issues: z.string().optional(),
          checks: z.string().optional(),
          metadata: z.string().optional(),
          contents: z.string().optional(),
          deployments: z.string().optional(),
        }),
      ),
      events: z.array(z.string()),
      installations_count: z.number().optional(),
      client_secret: z.string().optional(),
      webhook_secret: z.string().optional().nullable(),
      pem: z.string().optional(),
    }),
  )
  .nullable();

export const reactionRollupSchema = z.record(z.unknown()).and(
  z.object({
    url: z.string(),
    total_count: z.number(),
    "+1": z.number(),
    "-1": z.number(),
    laugh: z.number(),
    confused: z.number(),
    heart: z.number(),
    hooray: z.number(),
    eyes: z.number(),
    rocket: z.number(),
  }),
);

export const simpleUser3Schema = z.record(z.unknown()).and(
  z.object({
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string(),
    gravatar_id: z.string().nullable(),
    url: z.string(),
    html_url: z.string(),
    followers_url: z.string(),
    following_url: z.string(),
    gists_url: z.string(),
    starred_url: z.string(),
    subscriptions_url: z.string(),
    organizations_url: z.string(),
    repos_url: z.string(),
    events_url: z.string(),
    received_events_url: z.string(),
    type: z.string(),
    site_admin: z.boolean(),
    starred_at: z.string().optional(),
    user_view_type: z.string().optional(),
  }),
);

export const licenseSimpleSchema = z.record(z.unknown()).and(
  z.object({
    key: z.string(),
    name: z.string(),
    url: z.string().nullable(),
    spdx_id: z.string().nullable(),
    node_id: z.string(),
    html_url: z.string().optional(),
  }),
);

export const simpleUser4Schema = z.record(z.unknown()).and(
  z.object({
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string(),
    gravatar_id: z.string().nullable(),
    url: z.string(),
    html_url: z.string(),
    followers_url: z.string(),
    following_url: z.string(),
    gists_url: z.string(),
    starred_url: z.string(),
    subscriptions_url: z.string(),
    organizations_url: z.string(),
    repos_url: z.string(),
    events_url: z.string(),
    received_events_url: z.string(),
    type: z.string(),
    site_admin: z.boolean(),
    starred_at: z.string().optional(),
    user_view_type: z.string().optional(),
  }),
);

export const codeOfConductSchema = z.record(z.unknown()).and(
  z.object({
    key: z.string(),
    name: z.string(),
    url: z.string(),
    body: z.string().optional(),
    html_url: z.string().nullable(),
  }),
);

export const gitUserSchema = z.record(z.unknown()).and(
  z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    date: z.string().optional(),
  }),
);

export const verificationSchema = z.record(z.unknown()).and(
  z.object({
    verified: z.boolean(),
    reason: z.string(),
    payload: z.string().nullable(),
    signature: z.string().nullable(),
  }),
);

export const gitUser1Schema = z.record(z.unknown()).and(
  z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    date: z.string().optional(),
  }),
);

export const minimalRepositorySchema = z.record(z.unknown()).and(
  z.object({
    id: z.number(),
    node_id: z.string(),
    name: z.string(),
    full_name: z.string(),
    owner: simpleUserSchema,
    private: z.boolean(),
    html_url: z.string(),
    description: z.string().nullable(),
    fork: z.boolean(),
    url: z.string(),
    archive_url: z.string(),
    assignees_url: z.string(),
    blobs_url: z.string(),
    branches_url: z.string(),
    collaborators_url: z.string(),
    comments_url: z.string(),
    commits_url: z.string(),
    compare_url: z.string(),
    contents_url: z.string(),
    contributors_url: z.string(),
    deployments_url: z.string(),
    downloads_url: z.string(),
    events_url: z.string(),
    forks_url: z.string(),
    git_commits_url: z.string(),
    git_refs_url: z.string(),
    git_tags_url: z.string(),
    git_url: z.string().optional(),
    issue_comment_url: z.string(),
    issue_events_url: z.string(),
    issues_url: z.string(),
    keys_url: z.string(),
    labels_url: z.string(),
    languages_url: z.string(),
    merges_url: z.string(),
    milestones_url: z.string(),
    notifications_url: z.string(),
    pulls_url: z.string(),
    releases_url: z.string(),
    ssh_url: z.string().optional(),
    stargazers_url: z.string(),
    statuses_url: z.string(),
    subscribers_url: z.string(),
    subscription_url: z.string(),
    tags_url: z.string(),
    teams_url: z.string(),
    trees_url: z.string(),
    clone_url: z.string().optional(),
    mirror_url: z.string().optional().nullable(),
    hooks_url: z.string(),
    svn_url: z.string().optional(),
    homepage: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    forks_count: z.number().optional(),
    stargazers_count: z.number().optional(),
    watchers_count: z.number().optional(),
    size: z.number().optional(),
    default_branch: z.string().optional(),
    open_issues_count: z.number().optional(),
    is_template: z.boolean().optional(),
    topics: z.array(z.string()).optional(),
    has_issues: z.boolean().optional(),
    has_projects: z.boolean().optional(),
    has_wiki: z.boolean().optional(),
    has_pages: z.boolean().optional(),
    has_downloads: z.boolean().optional(),
    has_discussions: z.boolean().optional(),
    archived: z.boolean().optional(),
    disabled: z.boolean().optional(),
    visibility: z.string().optional(),
    pushed_at: z.string().optional().nullable(),
    created_at: z.string().optional().nullable(),
    updated_at: z.string().optional().nullable(),
    permissions: z
      .record(z.unknown())
      .and(
        z.object({
          admin: z.boolean().optional(),
          maintain: z.boolean().optional(),
          push: z.boolean().optional(),
          triage: z.boolean().optional(),
          pull: z.boolean().optional(),
        }),
      )
      .optional(),
    role_name: z.string().optional(),
    temp_clone_token: z.string().optional(),
    delete_branch_on_merge: z.boolean().optional(),
    subscribers_count: z.number().optional(),
    network_count: z.number().optional(),
    code_of_conduct: codeOfConductSchema.optional(),
    license: z
      .record(z.unknown())
      .and(
        z.object({
          key: z.string().optional(),
          name: z.string().optional(),
          spdx_id: z.string().optional(),
          url: z.string().optional().nullable(),
          node_id: z.string().optional(),
        }),
      )
      .optional()
      .nullable(),
    forks: z.number().optional(),
    open_issues: z.number().optional(),
    watchers: z.number().optional(),
    allow_forking: z.boolean().optional(),
    web_commit_signoff_required: z.boolean().optional(),
    security_and_analysis: z
      .record(z.unknown())
      .and(
        z.object({
          advanced_security: z
            .record(z.unknown())
            .and(
              z.object({
                status: z
                  .union([z.literal("enabled"), z.literal("disabled")])
                  .optional(),
              }),
            )
            .optional(),
          dependabot_security_updates: z
            .record(z.unknown())
            .and(
              z.object({
                status: z
                  .union([z.literal("enabled"), z.literal("disabled")])
                  .optional(),
              }),
            )
            .optional(),
          secret_scanning: z
            .record(z.unknown())
            .and(
              z.object({
                status: z
                  .union([z.literal("enabled"), z.literal("disabled")])
                  .optional(),
              }),
            )
            .optional(),
          secret_scanning_push_protection: z
            .record(z.unknown())
            .and(
              z.object({
                status: z
                  .union([z.literal("enabled"), z.literal("disabled")])
                  .optional(),
              }),
            )
            .optional(),
          secret_scanning_non_provider_patterns: z
            .record(z.unknown())
            .and(
              z.object({
                status: z
                  .union([z.literal("enabled"), z.literal("disabled")])
                  .optional(),
              }),
            )
            .optional(),
          secret_scanning_ai_detection: z
            .record(z.unknown())
            .and(
              z.object({
                status: z
                  .union([z.literal("enabled"), z.literal("disabled")])
                  .optional(),
              }),
            )
            .optional(),
        }),
      )
      .optional()
      .nullable(),
  }),
);

export const milestoneSchema = z.record(z.unknown()).and(
  z.object({
    url: z.string(),
    html_url: z.string(),
    labels_url: z.string(),
    id: z.number(),
    node_id: z.string(),
    number: z.number(),
    state: z.union([z.literal("open"), z.literal("closed")]),
    title: z.string(),
    description: z.string().nullable(),
    creator: simpleUser3Schema.nullable(),
    open_issues: z.number(),
    closed_issues: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    closed_at: z.string().nullable(),
    due_on: z.string().nullable(),
  }),
);

export const repositorySchema = z.record(z.unknown()).and(
  z.object({
    id: z.number(),
    node_id: z.string(),
    name: z.string(),
    full_name: z.string(),
    license: licenseSimpleSchema.nullable(),
    forks: z.number(),
    permissions: z
      .record(z.unknown())
      .and(
        z.object({
          admin: z.boolean(),
          pull: z.boolean(),
          triage: z.boolean().optional(),
          push: z.boolean(),
          maintain: z.boolean().optional(),
        }),
      )
      .optional(),
    owner: simpleUser4Schema,
    private: z.boolean(),
    html_url: z.string(),
    description: z.string().nullable(),
    fork: z.boolean(),
    url: z.string(),
    archive_url: z.string(),
    assignees_url: z.string(),
    blobs_url: z.string(),
    branches_url: z.string(),
    collaborators_url: z.string(),
    comments_url: z.string(),
    commits_url: z.string(),
    compare_url: z.string(),
    contents_url: z.string(),
    contributors_url: z.string(),
    deployments_url: z.string(),
    downloads_url: z.string(),
    events_url: z.string(),
    forks_url: z.string(),
    git_commits_url: z.string(),
    git_refs_url: z.string(),
    git_tags_url: z.string(),
    git_url: z.string(),
    issue_comment_url: z.string(),
    issue_events_url: z.string(),
    issues_url: z.string(),
    keys_url: z.string(),
    labels_url: z.string(),
    languages_url: z.string(),
    merges_url: z.string(),
    milestones_url: z.string(),
    notifications_url: z.string(),
    pulls_url: z.string(),
    releases_url: z.string(),
    ssh_url: z.string(),
    stargazers_url: z.string(),
    statuses_url: z.string(),
    subscribers_url: z.string(),
    subscription_url: z.string(),
    tags_url: z.string(),
    teams_url: z.string(),
    trees_url: z.string(),
    clone_url: z.string(),
    mirror_url: z.string().nullable(),
    hooks_url: z.string(),
    svn_url: z.string(),
    homepage: z.string().nullable(),
    language: z.string().nullable(),
    forks_count: z.number(),
    stargazers_count: z.number(),
    watchers_count: z.number(),
    size: z.number(),
    default_branch: z.string(),
    open_issues_count: z.number(),
    is_template: z.boolean().optional(),
    topics: z.array(z.string()).optional(),
    has_issues: z.boolean(),
    has_projects: z.boolean(),
    has_wiki: z.boolean(),
    has_pages: z.boolean(),
    has_downloads: z.boolean(),
    has_discussions: z.boolean().optional(),
    archived: z.boolean(),
    disabled: z.boolean(),
    visibility: z.string().optional(),
    pushed_at: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable(),
    allow_rebase_merge: z.boolean().optional(),
    temp_clone_token: z.string().optional(),
    allow_squash_merge: z.boolean().optional(),
    allow_auto_merge: z.boolean().optional(),
    delete_branch_on_merge: z.boolean().optional(),
    allow_update_branch: z.boolean().optional(),
    use_squash_pr_title_as_default: z.boolean().optional(),
    squash_merge_commit_title: z
      .union([z.literal("PR_TITLE"), z.literal("COMMIT_OR_PR_TITLE")])
      .optional(),
    squash_merge_commit_message: z
      .union([
        z.literal("PR_BODY"),
        z.literal("COMMIT_MESSAGES"),
        z.literal("BLANK"),
      ])
      .optional(),
    merge_commit_title: z
      .union([z.literal("PR_TITLE"), z.literal("MERGE_MESSAGE")])
      .optional(),
    merge_commit_message: z
      .union([z.literal("PR_BODY"), z.literal("PR_TITLE"), z.literal("BLANK")])
      .optional(),
    allow_merge_commit: z.boolean().optional(),
    allow_forking: z.boolean().optional(),
    web_commit_signoff_required: z.boolean().optional(),
    open_issues: z.number(),
    watchers: z.number(),
    master_branch: z.string().optional(),
    starred_at: z.string().optional(),
    anonymous_access_enabled: z.boolean().optional(),
  }),
);

export const userReposSchema = z.array(minimalRepositorySchema);

export const commitSearchResultItemSchema = z.record(z.unknown()).and(
  z.object({
    url: z.string(),
    sha: z.string(),
    html_url: z.string(),
    comments_url: z.string(),
    commit: z.record(z.unknown()).and(
      z.object({
        author: z.record(z.unknown()).and(
          z.object({
            name: z.string(),
            email: z.string(),
            date: z.string(),
          }),
        ),
        committer: gitUserSchema.nullable(),
        comment_count: z.number(),
        message: z.string(),
        tree: z.record(z.unknown()).and(
          z.object({
            sha: z.string(),
            url: z.string(),
          }),
        ),
        url: z.string(),
        verification: verificationSchema.optional(),
      }),
    ),
    author: simpleUserSchema.nullable(),
    committer: gitUser1Schema.nullable(),
    parents: z.array(
      z.record(z.unknown()).and(
        z.object({
          url: z.string().optional(),
          html_url: z.string().optional(),
          sha: z.string().optional(),
        }),
      ),
    ),
    repository: minimalRepositorySchema,
    score: z.number(),
    node_id: z.string(),
    text_matches: searchResultTextMatchesSchema.optional(),
  }),
);

export const issueSearchResultItemSchema = z.record(z.unknown()).and(
  z.object({
    url: z.string(),
    repository_url: z.string(),
    labels_url: z.string(),
    comments_url: z.string(),
    events_url: z.string(),
    html_url: z.string(),
    id: z.number(),
    node_id: z.string(),
    number: z.number(),
    title: z.string(),
    locked: z.boolean(),
    active_lock_reason: z.string().optional().nullable(),
    assignees: z.array(simpleUserSchema).optional().nullable(),
    user: simpleUser1Schema.nullable(),
    labels: z.array(
      z.record(z.unknown()).and(
        z.object({
          id: z.number().optional(),
          node_id: z.string().optional(),
          url: z.string().optional(),
          name: z.string().optional(),
          color: z.string().optional(),
          default: z.boolean().optional(),
          description: z.string().optional().nullable(),
        }),
      ),
    ),
    state: z.string(),
    state_reason: z.string().optional().nullable(),
    assignee: simpleUser2Schema.nullable(),
    milestone: milestoneSchema.nullable(),
    comments: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    closed_at: z.string().nullable(),
    text_matches: searchResultTextMatchesSchema.optional(),
    pull_request: z
      .record(z.unknown())
      .and(
        z.object({
          merged_at: z.string().optional().nullable(),
          diff_url: z.string().nullable(),
          html_url: z.string().nullable(),
          patch_url: z.string().nullable(),
          url: z.string().nullable(),
        }),
      )
      .optional(),
    body: z.string().optional().nullable(),
    score: z.number(),
    author_association: authorAssociationSchema,
    draft: z.boolean().optional(),
    repository: repositorySchema.optional(),
    body_html: z.string().optional(),
    body_text: z.string().optional(),
    timeline_url: z.string().optional(),
    performed_via_github_app: gitHubAppSchema.optional().nullable(),
    reactions: reactionRollupSchema.optional(),
  }),
);

export const commitsSearchResultSchema = z.record(z.unknown()).and(
  z.object({
    total_count: z.number(),
    incomplete_results: z.boolean(),
    items: z.array(commitSearchResultItemSchema),
  }),
);

export const issueSearchResultSchema = z.record(z.unknown()).and(
  z.object({
    total_count: z.number(),
    incomplete_results: z.boolean(),
    items: z.array(issueSearchResultItemSchema),
  }),
);
