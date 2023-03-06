import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

const GITHUB_USERS_MOCK = [
  { login: 'first_user', id: 1, avatar_url: '', html_url: 'https://github.com/1' },
  { login: 'second_user', id: 2, avatar_url: '', html_url: 'https://github.com/2' },
];

describe('app', () => {
  const unmockedFetch = global.fetch;

  beforeAll(() => {
    global.fetch = () =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(GITHUB_USERS_MOCK),
      } as Response);
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  test('should display common followers', async () => {
    render(<App />);
    const input1 = screen.getByLabelText('user1');
    const input2 = screen.getByLabelText('user2');
    const button = screen.getByText('Search');

    expect(button).not.toBeDisabled();
    userEvent.click(button);

    await waitFor(() => expect(screen.getAllByText('Required')[0]).toBeInTheDocument());

    fireEvent.change(input1, { target: { value: 'user1' } });
    fireEvent.change(input2, { target: { value: 'user2' } });

    userEvent.click(button);

    await waitFor(() => expect(screen.getByText('first_user')).toBeInTheDocument());
  });
});
