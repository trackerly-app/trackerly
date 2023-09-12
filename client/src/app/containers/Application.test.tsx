import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import { beforeEach, describe, it } from 'node:test';
import ApplicationForm, { ApplicationProps } from './ApplicationForm';

describe('ApplicationForm has elements', () => {
  beforeEach(() => {
    const props: ApplicationProps = {
      user_id: 1,
    };

    render(<ApplicationForm props={props} />);
  });

  it('has all required elements', () => {});
});

describe('ApplicationForm manipulates data', () => {});
