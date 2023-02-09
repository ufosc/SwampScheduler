import React from 'react';
import { render, screen } from '@testing-library/react';
import MainDisplay from './components/MainDisplay';

test('renders learn react link', () => {
  render(<MainDisplay />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
