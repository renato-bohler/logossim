import React from 'react';

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;

  label {
    font-size: 0.8em;
    font-weight: bold;
    text-transform: uppercase;
    color: ${props => (props.error ? '#710606' : 'inherit')};

    background: #eee;
    border: 1px solid ${props => (props.error ? '#c80a0a' : 'gray')};
    border-radius: 8px;

    position: relative;
    top: 0.8em;

    width: max-content;
    margin-left: 15px;
    padding: 0 8px;
  }

  select,
  input {
    background: white;
    border: 1px solid ${props => (props.error ? '#c80a0a' : 'gray')};
    border-radius: 25px;

    font-size: 1.2em;

    padding: 10px 0 5px 16px;
  }

  input[type='file'] {
    font-size: 1em;
    margin-top: 2px;
  }
`;

const Input = ({
  // Formik
  form,
  field,
  // General
  name,
  label,
  componentType,
  type,
  innerRef,
  // Select
  options = [],
  // Number
  step,
  min,
  max,
}) => {
  const handleBinaryLoad = event => {
    const {
      target: { files },
    } = event;

    if (files.length !== 1) return;

    const handleError = () =>
      this.showSnackbar(
        `Error loading binary file:\n${files[0].name}`,
      );

    const fr = new FileReader();
    fr.onerror = handleError;
    fr.onload = e => {
      try {
        const file = e.target.result;
        form.setFieldValue(field.name, file);
      } catch (exception) {
        handleError();
      }
    };
    fr.readAsText(files.item(0));
  };

  switch (type) {
    case 'select':
      return (
        <>
          <label htmlFor={name}>{label}</label>
          <select id={name} ref={innerRef} {...field}>
            {options.map(option => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      );
    case 'number':
      return (
        <>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            ref={innerRef}
            {...field}
            step={step}
            min={min}
            max={max}
            type="number"
          />
        </>
      );
    case 'text':
      return (
        <>
          <label htmlFor={name}>{label}</label>
          <input id={name} ref={innerRef} {...field} type="text" />
        </>
      );
    case 'binary':
      return (
        <>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            accept=".lgbin"
            type="file"
            onChange={handleBinaryLoad}
          />
        </>
      );
    default:
      throw new Error(
        `[logossim] Invalid configuration type for ${componentType}: ${type}`,
      );
  }
};

const ErrorMessage = styled.div`
  font-size: 0.8em;
  color: #c80a0a;

  background: white;

  position: relative;
  bottom: 0.7em;

  width: max-content;
  padding: 0 8px;
  margin: -15px auto auto auto;
  transform: translateY(15px);
`;

const ComponentConfigurationInput = props => {
  const {
    field: { name },
    form: { errors },
  } = props;

  const error = errors[name];

  return (
    <Container error={error}>
      <Input {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default ComponentConfigurationInput;
