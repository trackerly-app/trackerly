import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import CompanyForm, { CompanyProps, getIcon } from './CompanyForm';

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

  // these tests are running into CORS issues, not sure how to resolve this
  // tabling for later
  xtest('gets a good favicon from an indicated website', async () => {
    const knownWebsite = 'http://www.google.com/';

    const icon = await getIcon(knownWebsite);
    expect(icon).not.toBe('I');
  });

  xtest('returns a default favicon if one cannot be found', async () => {
    // this shouldn't match the original website and shouldn't be found
    const badWebsite = 'nothinghere';

    const icon = await getIcon(badWebsite);
    expect(icon).toBe('I');
  });

  test('submits data when submit is clicked', () => {
    renderCompany();

    const handleOnSubmitMock = jest.fn();

    const form = screen.getByRole('form', { name: 'edit_company' });
    form.onsubmit = handleOnSubmitMock;

    const submit = screen.getByTestId('submit_button');
    expect(submit).toBeInTheDocument();

    submit.click();
    expect(handleOnSubmitMock).toHaveBeenCalled();
  });

  // we are holding off on client-side validation for now
  xtest('does not submit if required fields are missing', () => {});
});

// need more research into integration testing
xdescribe('CompanyForm mutates data', () => {});
