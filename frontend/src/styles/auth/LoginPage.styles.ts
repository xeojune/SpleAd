import styled from 'styled-components';

export const PageContainer = styled.div`
  max-width: 24.5625rem;
  font-family: Pretendard JP;
  margin: 0 auto;
  padding-bottom: 4.375rem;
  background: white;
  min-height: 53.25rem;
  display: flex;
  flex-direction: column;
  
  @media screen and (max-width: 48rem) {
    max-width: none;
    padding-bottom: 3.75rem;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: 3.25rem;
  padding: 0 1.25rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 10;
  max-width: 24.5625rem;
  margin: 0 auto;
  
  @media screen and (max-width: 48rem) {
    max-width: none;
    padding: 0 1rem;
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 3.25rem; /* Same as header height */
  padding: 0 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media screen and (max-width: 48rem) {
    padding: 0 1rem;
  }
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-right: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #1e293b;
`;

export const RotatedArrow = styled.div`
  transform: rotate(180deg);
  display: flex;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
`;

export const Logo = styled.img`
  width: 8rem;
  margin: 6rem 0;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 500;
  padding: 0 0.25rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #1e293b;
  background-color: #fff;
  
  &::placeholder {
    color: #7D8CAE;
  }
  
  &:focus {
    outline: none;
    border-color: #FF6EA5;
    box-shadow: 0 0 0 1px #FF6EA5;
  }
`;

export const ErrorMessage = styled.span`
  padding: 0 0.25rem;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background-color: #FF6EA5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #FF5593;
  }
  
  &:disabled {
    background-color: #E2E8F0;
    color: #7D8CAE;
    cursor: not-allowed;
  }
`;

export const Links = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  width: 100%;
  padding: 0 0.5rem;
  
  a {
    color: #7D8CAE;
    text-decoration: none;
    font-size: 0.875rem;
    width: 100%;
    text-align: center;
    padding: 0.5rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;