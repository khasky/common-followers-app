import intersectionBy from 'lodash/intersectionBy';
import React from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useFollowersApi, FollowerModel } from '../api/useGithubApi';
import FollowersForm, { FormValues } from '../components/FollowersForm';
import FollowersList from '../components/FollowersList';

function FollowersPage() {
  const { request, error, isLoading, data } = useFollowersApi();

  const commonFollowers = React.useMemo(() => {
    if (data && Object.keys(data).length) {
      const arrays = Object.values(data);
      return intersectionBy<FollowerModel>(...arrays, 'id');
    }
    return [];
  }, [data]);

  const search = async ({ user1, user2 }: FormValues) => {
    await request(user1, user2);
  };

  return (
    <Box
      p={4}
      display='flex'
      alignItems='center'
      justifyContent='center'
      maxWidth='600px'
      marginLeft='auto'
      marginRight='auto'
    >
      <Box>
        <FollowersForm onSubmit={search} />

        <Box mt={1}>
          <Typography variant='h6' paragraph>
            Common followers:
          </Typography>

          {isLoading || error ? (
            <>
              {isLoading && (
                <Box mt={1}>
                  <Stack spacing={1}>
                    <Skeleton variant='rounded' width={200} height={10} />
                    <Skeleton variant='rounded' width={200} height={10} />
                    <Skeleton variant='rounded' width={200} height={10} />
                  </Stack>
                </Box>
              )}
              {!isLoading && error && <Typography color='red'>{error}</Typography>}
            </>
          ) : (
            <FollowersList followers={commonFollowers} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default FollowersPage;
