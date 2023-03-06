import React from 'react';

import { parseLinkHeader } from '@web3-storage/parse-link-header';

export type FollowerModel = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  [key: string]: unknown;
};

type FollowersDataResponseType = Record<string, FollowerModel[]>;
type FollowersErrorResponseType = { message: string };

interface FetchResponseType {
  data: FollowerModel[];
  headers: Response['headers'];
}

const PER_PAGE = 100; // Default 30, max 100

// TODO: handle rate limits
// For unauthenticated requests, the rate limit allows for up to 60 requests per hour.
// Error: API rate limit exceeded for X.X.X.X (But here's the good news: Authenticated requests get a higher rate limit.
// Check out the documentation for more details.)

const buildFollowersApiUrl = (user: string, page: number) =>
  `https://api.github.com/users/${user}/followers?per_page=${PER_PAGE}&page=${page}`;

const fetchFollowers = async (user: string, page: number) => {
  const resp = await fetch(buildFollowersApiUrl(user, page));
  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(
      `Search for user "${user}" failed: ${
        (data as FollowersErrorResponseType).message || `Status: ${resp.status}`
      }`
    );
  }

  return {
    data,
    headers: resp.headers,
  } as FetchResponseType;
};

async function* fetchFollowersBulkGenerator(user: string) {
  let nextPage = 1;

  while (true) {
    const { data, headers } = await fetchFollowers(user, nextPage);
    yield data;
    const linkHeader =
      typeof headers?.get === 'function' ? parseLinkHeader(headers.get('link')) : undefined;
    if (linkHeader?.next?.page) {
      nextPage = Number(linkHeader.next.page);
    } else {
      // no next page
      break;
    }
  }
}

const fetchFollowersBulk = async (user: string) => {
  const items: FollowerModel[] = [];
  for await (const data of fetchFollowersBulkGenerator(user)) {
    items.push(...data);
  }
  return {
    [user]: items,
  };
};

export function useFollowersApi() {
  const [data, setData] = React.useState<FollowersDataResponseType>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);

  const request = async (user1: string, user2: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const responses = await Promise.all([fetchFollowersBulk(user1), fetchFollowersBulk(user2)]);
      const dataAsObject = Object.assign({}, ...responses);
      setData(dataAsObject);
    } catch (err) {
      let message = 'Unknown Error';
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      setData({});
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, request };
}
