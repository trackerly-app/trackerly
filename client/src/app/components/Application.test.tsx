import 'jest';
import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import { beforeEach, describe, it } from 'node:test';
import ApplicationForm, { AppProps, validateData } from './ApplicationForm';

const defaultProps: AppProps = {
  user_id: 1,
  company_id: 1,
  company_name: 'Test',
};

const renderApp = (props: AppProps = defaultProps) => {
  const modProps = Object.assign(defaultProps, props);
  return render(<ApplicationForm {...modProps} />);
};
describe('ApplicationForm has elements', () => {
  // for some reason this doesn't work.
  // TODO: Figure out why I can't seem to get this to work
  // beforeEach(() => {
  //   render(<ApplicationForm {...props} />);
  // });

  // required inhereted elements
  // user_id
  // company_id
  test('has all inhereted elements', () => {
    renderApp();
    const reqFields = ['user_id', 'company_id'];

    reqFields.forEach((field) => {
      const inputEl = screen.getByTestId(field);
      expect(inputEl).toBeInTheDocument();
      expect(inputEl).not.toBeVisible();
    });
  });

  // required elements:
  // position
  // salary
  // status
  // notes
  // application_url
  test('has all required elements', () => {
    renderApp();
    const reqFields = [
      'position',
      'salary',
      'status',
      'notes',
      'application_url',
    ];

    reqFields.forEach((field) => {
      const inputEl = screen.getByTestId(field);
      expect(inputEl).toBeInTheDocument();
      expect(inputEl).toBeVisible();
    });
  });

  test('company name cannot be edited', () => {
    renderApp();

    const companyField = screen.getByTestId('company');

    const companyName = companyField.nodeValue;
    fireEvent.change(companyField, {
      target: {
        value: 'New Value',
      },
    });

    expect(companyField).not.toBeNull;
    expect(companyField.nodeValue).toBe(companyName);
  });

  test('submits data when submit is clicked', () => {
    renderApp();

    const handleOnSubmitMock = jest.fn();

    const form = screen.getByRole('form', { name: 'edit_application' });
    form.onsubmit = handleOnSubmitMock;

    const submit = screen.getByTestId('submit_button');
    expect(submit).toBeInTheDocument();

    submit.click();
    expect(handleOnSubmitMock).toHaveBeenCalled();
  });

  // we are holding off on client-side validation for now
  xtest('submit will not fire if required fields are empty', () => {});
});

// need more research into integration testing
xdescribe('ApplicationForm manipulates data', () => {
  test('imports data when there is a props.id', () => {});
});
