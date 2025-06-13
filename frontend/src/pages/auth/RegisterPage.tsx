import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import DaumPostcode from 'react-daum-postcode';
import axios from 'axios';
import {
  LoginContainer,
  LeftPanel,
  RightPanel,
  Logo,
  LoginForm,
  Title,
  InputGroup,
  Label,
  Input,
  LoginButton,
  GoogleButton,
  SignUpText,
  Divider,
} from '../../styles/auth/LoginPage.styles';
import spleadLogo from '../../assets/logo.png';
import opendreamLogo from '../../assets/opendreamlogo.png';
import googleIcon from '../../assets/google.png';
import { AddressButton, AddressInputWrapper, Modal, Overlay } from '../../styles/auth/RegisterPage.styles';
import { ProgressBar, Progress, ButtonGroup } from '../../styles/auth/RegisterPage.styles';
import { ValidationMessage } from '../../styles/auth/RegisterPage.styles';
import { authApi } from '../../apis/masterAuth';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  postCode: string;
  address: string;
  detailAddress: string;
  accountNumber: string;
  name: string;
}

interface ValidationState {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  accountNumber: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    postCode: '',
    address: '',
    detailAddress: '',
    accountNumber: '',
    name: '',
  });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string>('');
  const [validations, setValidations] = useState<ValidationState>({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    accountNumber: '',
  });

  const validateEmail = (email: string) => {
    if (!email) {
      return '이메일 또는 아이디를 입력해주세요';
    }
    if (email.length < 3) {
      return '이메일 또는 아이디는 3자 이상이어야 합니다';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return '비밀번호를 입력해주세요';
    }
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다';
    }
    if (!/[A-Z]/.test(password)) {
      return '비밀번호는 대문자를 포함해야 합니다';
    }
    if (!/[a-z]/.test(password)) {
      return '비밀번호는 소문자를 포함해야 합니다';
    }
    if (!/[0-9]/.test(password)) {
      return '비밀번호는 숫자를 포함해야 합니다';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return '비밀번호는 특수문자(!@#$%^&*)를 포함해야 합니다';
    }
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      return '비밀번호 확인을 입력해주세요';
    }
    if (password !== confirmPassword) {
      return '비밀번호가 일치하지 않습니다';
    }
    return '';
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!phoneNumber) {
      return '전화번호를 입력해주세요';
    }
    if (!phoneRegex.test(phoneNumber)) {
      return '올바른 전화번호 형식이 아닙니다';
    }
    return '';
  };

  const validateAccountNumber = (accountNumber: string) => {
    const accountRegex = /^[0-9]{10,14}$/;
    if (!accountNumber) {
      return '계좌번호를 입력해주세요';
    }
    if (!accountRegex.test(accountNumber)) {
      return '올바른 계좌번호 형식이 아닙니다';
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate input based on field name
    switch (name) {
      case 'email':
        setValidations(prev => ({ ...prev, email: validateEmail(value) }));
        break;
      case 'password':
        setValidations(prev => ({ 
          ...prev, 
          password: validatePassword(value),
          confirmPassword: validateConfirmPassword(value, formData.confirmPassword)
        }));
        break;
      case 'confirmPassword':
        setValidations(prev => ({ 
          ...prev, 
          confirmPassword: validateConfirmPassword(formData.password, value)
        }));
        break;
      case 'phoneNumber':
        setValidations(prev => ({ ...prev, phoneNumber: validatePhoneNumber(value) }));
        break;
      case 'accountNumber':
        setValidations(prev => ({ ...prev, accountNumber: validateAccountNumber(value) }));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep(step)) {
      return;
    }

    if (step === 1 || step === 2) {
      setStep(step + 1);
    } else {
      try {
        await authApi.signup(formData);
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        navigate('/login');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
        } else {
          setError('회원가입 중 오류가 발생했습니다.');
        }
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = (data: any) => {
    setFormData(prev => ({
      ...prev,
      postCode: data.zonecode,
      address: data.address
    }));
    setIsAddressModalOpen(false);
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        const emailError = validateEmail(formData.email);
        if (emailError) {
          setError(emailError);
          return false;
        }
        break;
      case 2:
        const passwordError = validatePassword(formData.password);
        const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
        if (passwordError || confirmError) {
          setError(passwordError || confirmError);
          return false;
        }
        break;
      case 3:
        const phoneError = validatePhoneNumber(formData.phoneNumber);
        const accountError = validateAccountNumber(formData.accountNumber);
        if (phoneError || accountError) {
          setError(phoneError || accountError);
          return false;
        }
        if (!formData.postCode || !formData.address) {
          setError('주소를 입력해주세요');
          return false;
        }
        break;
    }
    return true;
  };

  return (
    <LoginContainer>
      <LeftPanel>
        <img src={spleadLogo} alt="Splead Logo" />
      </LeftPanel>
      <RightPanel>
        <Logo>
          <img src={opendreamLogo} alt="OpenDream Logo" />
        </Logo>
        <LoginForm onSubmit={handleSubmit}>
          <Title>Create your account</Title>

          <ProgressBar>
            <Progress step={step} />
          </ProgressBar>

          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

          {step === 1 ? (
            <>
              <InputGroup>
                <Label htmlFor="email">이메일 또는 아이디</Label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일 또는 아이디를 입력해주세요"
                  required
                />
                {validations.email && (
                  <ValidationMessage isError={true}>{validations.email}</ValidationMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="name">이름</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="이름을 입력해주세요"
                  required
                />
              </InputGroup>

              <LoginButton type="submit">다음</LoginButton>

              <Divider>
                <span>Or</span>
              </Divider>

              <GoogleButton type="button">
                <img src={googleIcon} alt="Google" />
                또는 구글로 로그인
              </GoogleButton>

              <SignUpText>
                계정이 있으신가요? <a href="/login">로그인</a>
              </SignUpText>
            </>
          ) : step === 2 ? (
            <>
              <InputGroup>
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력해주세요"
                  required
                />
                {validations.password && (
                  <ValidationMessage isError={true}>{validations.password}</ValidationMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 다시 입력해주세요"
                  required
                />
                {validations.confirmPassword && (
                  <ValidationMessage isError={true}>{validations.confirmPassword}</ValidationMessage>
                )}
              </InputGroup>

              <ButtonGroup>
                <LoginButton type="button" onClick={handleBack}>이전</LoginButton>
                <LoginButton type="submit">다음</LoginButton>
              </ButtonGroup>
            </>
          ) : (
            <>
              <InputGroup>
                <Label htmlFor="phoneNumber">전화번호</Label>
                <Input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="전화번호를 입력해주세요"
                  required
                />
                {validations.phoneNumber && (
                  <ValidationMessage isError={true}>{validations.phoneNumber}</ValidationMessage>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="address">주소</Label>
                <AddressInputWrapper>
                  <Input
                    type="text"
                    id="postCode"
                    name="postCode"
                    value={formData.postCode}
                    readOnly
                    placeholder="우편번호"
                    required
                  />
                  <AddressButton type="button" onClick={() => setIsAddressModalOpen(true)}>
                    검색
                  </AddressButton>
                </AddressInputWrapper>
                {formData.postCode && (
                  <>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      readOnly
                      placeholder="주소"
                      required
                      style={{ marginTop: '8px' }}
                    />
                    <Input
                      type="text"
                      name="detailAddress"
                      value={formData.detailAddress}
                      onChange={handleInputChange}
                      placeholder="상세 주소"
                      required
                      style={{ marginTop: '8px' }}
                    />
                  </>
                )}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="accountNumber">은행 계좌번호</Label>
                <Input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="은행 계좌번호를 입력해주세요"
                  required
                />
                {validations.accountNumber && (
                  <ValidationMessage isError={true}>{validations.accountNumber}</ValidationMessage>
                )}
              </InputGroup>

              <ButtonGroup>
                <LoginButton type="button" onClick={handleBack}>이전</LoginButton>
                <LoginButton type="submit">회원가입</LoginButton>
              </ButtonGroup>
            </>
          )}
        </LoginForm>
      </RightPanel>

      {isAddressModalOpen && (
        <>
          <Overlay onClick={() => setIsAddressModalOpen(false)} />
          <Modal>
            <DaumPostcode onComplete={handleComplete} />
          </Modal>
        </>
      )}
    </LoginContainer>
  );
};

export default RegisterPage;