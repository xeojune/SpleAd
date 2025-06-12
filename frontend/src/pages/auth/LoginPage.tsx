import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  LoginContainer,
  LeftPanel,
  RightPanel,
  LoginForm,
  Logo,
  InputGroup,
  Label,
  Input,
  RememberMeContainer,
  CheckboxLabel,
  LoginButton,
  GoogleButton,
  ForgotPassword,
  SignUpText,
  Divider,
  Title,
} from '../../styles/auth/LoginPage.styles';
import spleadLogo from '../../assets/logo.png';
import opendreamLogo from '../../assets/opendreamlogo.png';
import googleIcon from '../../assets/google.png';


const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email and password are filled
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    // Show success message and navigate
    alert('Successful login');
    navigate('/link');
  };

  return (
    <LoginContainer>
      <LeftPanel>
        <img src={spleadLogo} alt="Splead" />
      </LeftPanel>
      
      <RightPanel>
        <Logo>
          <img src={opendreamLogo} alt="OpenDream" />
        </Logo>
        <LoginForm onSubmit={handleSubmit}>
          <Title>Login</Title>

          <InputGroup>
            <Label htmlFor="email">이메일 또는 아이디</Label>
            <Input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일 또는 아이디를 입력해주세요"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요"
            />
          </InputGroup>

          <RememberMeContainer>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              아이디 저장하기
            </CheckboxLabel>
            <ForgotPassword href="/forgot-password">비밀번호 찾기</ForgotPassword>
          </RememberMeContainer>

          <LoginButton type="submit">로그인</LoginButton>
          
          <Divider>
            <span>Or</span>
          </Divider>

          <GoogleButton type="button">
            <img src={googleIcon} alt="Google" />
            또는 구글로 로그인
          </GoogleButton>

          <SignUpText>
            계정이 없으신가요? <a href="/register">회원가입</a>
          </SignUpText>
        </LoginForm>
      </RightPanel>
    </LoginContainer>
  );
};

export default LoginPage;