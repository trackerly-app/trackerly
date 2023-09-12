import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import CompanyForm, { CompanyProps } from './CompanyForm';

const defaultProps: CompanyProps = {
  user_id: 1,
  id: 1,
};

const renderCompany = (props = defaultProps) => {
  props = Object.assign(defaultProps, props);
  return render(<CompanyForm {...props} />);
};

describe('CompanyForm has elements', () => {
  test('has all inhereted elements', () => {
    renderCompany();
    const reqFields = ['id', 'user_id'];

    reqFields.forEach((field) => {
      const inputEl = screen.getByTestId(field);
      expect(inputEl).toBeInTheDocument();
      expect(inputEl).not.toBeVisible();
    });
  });

  test('has all required elements', () => {
    renderCompany();
    const reqFields = ['name', 'website', 'notes'];

    reqFields.forEach((field) => {
      const inputEl = screen.getByTestId(field);
      expect(inputEl).toBeInTheDocument();
      expect(inputEl).toBeVisible();
    });
  });
});

xdescribe('CompanyForm mutates data', () => {});
