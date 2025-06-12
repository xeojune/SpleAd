import styled from 'styled-components';

export const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
`;

export const LeftPanel = styled.div`
  flex: 0 0 50%;
  width: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    min-width: 50%;
    min-height: 50%;
    object-fit: cover;
    top: 0;
    left: 0;
  }
`;

export const RightPanel = styled.div`
  flex: 0 0 50%;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #ffffff;
`;

export const Logo = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  margin-bottom: 50px;
  max-width: 400px;
  transform: translateX(-13%);
  
  img {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }
  
  span {
    font-size: 20px;
    font-weight: 600;
  }
`;

export const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  margin-bottom: 24px;
  text-align: center;
  width: 100%;
`;

export const SubTitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  margin-bottom: 24px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
  margin-left: 12px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f5f5f5;
  
  &:focus {
    outline: none;
    border-color: #FF69B4;
    background-color: #ffffff;
  }

  &::placeholder {
    color: #999;
  }
`;

export const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #FF69B4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #FF1493;
  }
`;

export const GoogleButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #444;
  }

  img {
    width: 30px;
    height: 30px;
  }
`;

export const ForgotPassword = styled.a`
  color: #FF69B4;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const SignUpText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 24px;

  a {
    color: #FF69B4;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 16px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e6e6e6;
  }

  span {
    padding: 0 16px;
    color: #666;
    font-size: 14px;
  }
`;