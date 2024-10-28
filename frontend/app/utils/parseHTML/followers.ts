import * as cheerio from 'cheerio';

export interface FollowerInfo {
    name: string
    route?: string
    company?: string
    location?: string
}

export const parseFollowersHTML = (html: string): FollowerInfo[] => {
    const result:FollowerInfo[] = []
    
    const $ = cheerio.load(html);
    const followersCardContainer = $('.position-relative')
    const followers = followersCardContainer.find('div').toArray();
    followers.forEach(follower => {
        const name = $(follower).find('.Link--primary').text();
        const route = $(follower).find('.Link--secondary').text();
        const company = $(follower).find('.mr-3').text();
        const location = $(follower).find('.mb-0').text();
        result.push({ name, route, company, location });
    });

    return result;
}