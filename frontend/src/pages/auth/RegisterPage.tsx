import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
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

const RegisterPage: React.FC = () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // Add your registration logic here
      console.log(formData);
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

              <LoginButton type="submit">{Number(step) === 3 ? '회원가입' : '다음'}</LoginButton>

              <Divider>
                <span>Or</span>
              </Divider>

              <GoogleButton type="button">
                <img src={googleIcon} alt="Google" />
                또는 구글로 로그인
              </GoogleButton>

              <SignUpText>
                계정이 없으신가요? <a href="/login">로그인</a>
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
              </InputGroup>

              <ButtonGroup>
                <LoginButton type="button" onClick={handleBack}>이전</LoginButton>
                <LoginButton type="submit">{Number(step) === 3 ? '회원가입' : '다음'}</LoginButton>
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
              </InputGroup>

              <ButtonGroup>
                <LoginButton type="button" onClick={handleBack}>이전</LoginButton>
                <LoginButton type="submit">{Number(step) === 3 ? '회원가입' : '다음'}</LoginButton>
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