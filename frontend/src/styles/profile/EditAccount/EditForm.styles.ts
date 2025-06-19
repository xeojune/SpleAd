import styled from 'styled-components';

export const FormContainer = styled.div`
  padding: 1rem;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 1rem;
`;

export const RotatedArrow = styled.div`
    transform: rotate(180deg);
    display: flex;
    align-items: center;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-right: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  color: #1e293b;
`;

export const Title = styled.h1`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  position: relative;
  padding: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:disabled {
    background-color: #f5f5f5;
    color: #7D8CAE;
  }

  &::placeholder {
    color: #999;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #f0f3f8;
  border: none;
  border-radius: 4px;
  color: #000;
  font-size: 16px;
  cursor: pointer;
  margin-top: auto;
  position: sticky;
  bottom: 20px;

  &:hover {
    background-color: #e0e3e8;
  }
`;