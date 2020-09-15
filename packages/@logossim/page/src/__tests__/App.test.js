import React from 'react';

import { render } from '@testing-library/react';

import App from '../App';

it('renders save button', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/save/i);
  expect(linkElement).toBeInTheDocument();
});
