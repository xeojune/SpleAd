import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageContainer, Header, BackButton, RotatedArrow, ContentArea, Title, Logo, Form, InputGroup, Label, Input, ErrorMessage, LoginButton, Links } from '../../styles/auth/LoginPage.styles';
import { authApi } from '../../apis/masterAuth';
import ArrowIcon from '../../components/icons/ArrowIcon';
import logo from '../../assets/logo.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (!value) {
      setEmailError('メールアドレスを入力してください。');
    } else if (!isValidEmail(value)) {
      setEmailError('正しいメールアドレスの形式で入力してください。');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (!value) {
      setPasswordError('パスワードを入力してください。');
      return;
    }

    const errors: string[] = [];
    
    if (value.length < 8) {
      errors.push('パスワードは8文字以上で入力してください。');
    }
    if (!/[a-z]/.test(value)) {
      errors.push('小文字を1文字以上含めてください。');
    }
    if (!/[A-Z]/.test(value)) {
      errors.push('大文字を1文字以上含めてください。');
    }
    if (!/[0-9]/.test(value)) {
      errors.push('数字を1文字以上含めてください。');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push('記号を1文字以上含めてください。');
    }

    setPasswordError(errors.length > 0 ? errors.join('\n') : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !isValidEmail(email) || passwordError) {
      return;
    }
    
    setIsLoading(true);
    try {
      await authApi.login({ email, password });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response?.status === 401) {
        setEmailError('メールアドレスまたはパスワードが正しくありません。');
      } else {
        alert('ログインに失敗しました。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/dashboard')}>
          <RotatedArrow>
            <ArrowIcon />
          </RotatedArrow>
        </BackButton>
        <Title>ログイン</Title>
      </Header>
      <ContentArea>
        <Logo src={logo} alt="COCO Logo" />
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>メールアドレス</Label>
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="メールアドレスを入力"
              required
            />
            {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          </InputGroup>
          <InputGroup>
            <Label>パスワード</Label>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="パスワードを入力"
              required
            />
            {passwordError && <ErrorMessage style={{ whiteSpace: 'pre-line' }}>{passwordError}</ErrorMessage>}
          </InputGroup>
          <LoginButton type="submit" disabled={!isFormValid || isLoading}>
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </LoginButton>
        </Form>
        <Links>
          <a href="/register">新規登録</a>
          <a href="#">ID/パスワードを忘れた方</a>
        </Links>
      </ContentArea>
    </PageContainer>
  );
};

export default LoginPage;