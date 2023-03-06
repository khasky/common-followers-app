import styled from 'styled-components';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { FollowerModel } from '../api/useGithubApi';

interface FollowersListProps {
  followers: FollowerModel[];
}

const FollowerAvatar = styled.img`
  max-height: 48px;
`;

// TODO: consider virtual scroll for long list
function FollowersList({ followers }: FollowersListProps) {
  return (
    <Box maxHeight='70vh' overflow='auto'>
      {followers.map((follower, index) => (
        <Box
          key={follower.id}
          mt={index > 0 ? 1 : 0}
          display='flex'
          alignItems='center'
          columnGap={2}
        >
          <Box display='flex'>
            <FollowerAvatar src={follower.avatar_url} alt={follower.login} />
          </Box>
          <Box>
            <Link href={follower.html_url} target='_blank'>
              {follower.login}
            </Link>
          </Box>
        </Box>
      ))}

      {followers.length === 0 && <Typography>Nothing to display here.</Typography>}
    </Box>
  );
}

export default FollowersList;
