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
import { authApi } from '../../apis/masterAuth';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check if email and password are filled
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });
      
      // Store user ID and token
      if (response.user?.id) {
        localStorage.setItem('user_id', response.user.id);
      }
      
      // If remember me is checked, save email
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Navigate to dashboard after successful login
      navigate('/link');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

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

          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

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