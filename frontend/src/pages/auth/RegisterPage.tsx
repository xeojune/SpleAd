import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { 
  PageContainer, 
  Header, 
  BackButton, 
  RotatedArrow, 
  ContentArea, 
  Title, 
  Logo, 
  Form, 
  InputGroup, 
  Label, 
  Input, 
  ErrorMessage, 
  LoginButton 
} from '../../styles/auth/LoginPage.styles';
import { authApi } from '../../apis/masterAuth';
import ArrowIcon from '../../components/icons/ArrowIcon';
import logo from '../../assets/logo.png';

interface RegisterFormData {
  email: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    lastName: '',
    firstNameKana: '',
    lastNameKana: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameKanaError, setNameKanaError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'email') {
      validateEmail(value);
    } else if (name === 'password') {
      validatePassword(value);
      if (formData.confirmPassword) {
        validateConfirmPassword(value, formData.confirmPassword);
      }
    } else if (name === 'confirmPassword') {
      validateConfirmPassword(formData.password, value);
    } else if (name === 'lastName') {
      validateName(value);
    } else if (name === 'lastNameKana' || name === 'firstNameKana') {
      validateNameKana(formData.lastNameKana, formData.firstNameKana);
    }
  };

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('メールアドレスを入力してください。\n이메일 주소를 입력해 주세요.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('正しいメールアドレスの形式で入力してください。\n올바른 이메일 주소 형식으로 입력해 주세요.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (!password) {
      setPasswordError('パスワードを入力してください。\n비밀번호를 입력해 주세요.');
      return false;
    }
    
    if (password.length < 8) {
      errors.push('パスワードは8文字以上で入力してください。\n비밀번호는 8자 이상이어야 합니다.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('小文字を1文字以上含めてください。\n소문자를 1자 이상 포함해야 합니다.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('大文字を1文字以上含めてください。\n대문자를 1자 이상 포함해야 합니다.');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('数字を1文字以上含めてください。\n숫자를 1자 이상 포함해야 합니다.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('記号を1文字以上含めてください。\n특수문자를 1자 이상 포함해야 합니다.');
    }

    setPasswordError(errors.length > 0 ? errors.join('\n') : '');
    return errors.length === 0;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('パスワード（確認用）を入力してください。\n비밀번호(확인용)를 입력해 주세요。');
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('パスワードが一致しません。\n비밀번호가 일치하지 않습니다。');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const validateName = (name: string) => {
    if (!name) {
      setNameError('名前を入力してください。\n이름을 입력해 주세요。');
      return false;
    }
    // Check if input contains at least one CJK character
    // Unicode ranges for CJK characters:
    // \u4E00-\u9FFF: CJK Unified Ideographs (Common Hanzi/Kanji/Hanja)
    // \u3400-\u4DBF: CJK Unified Ideographs Extension A
    // \uF900-\uFAFF: CJK Compatibility Ideographs
    const cjkRegex = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/;
    if (!cjkRegex.test(name)) {
      setNameError('漢字で入力してください。\n한자로 입력해 주세요。');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateNameKana = (lastName: string, firstName: string) => {
    if (!lastName || !firstName) {
      setNameKanaError('ふりがなを入力してください。\n후리가나를 입력해 주세요。');
      return false;
    }

    // Check if input contains only hiragana
    const hiraganaRegex = /^[\u3040-\u309F]+$/;
    if (!hiraganaRegex.test(lastName) || !hiraganaRegex.test(firstName)) {
      setNameKanaError('ふりがなは、ひらがなで入力してください（例：やまだ たろう）。\n후리가나는 히라가나로 입력해 주세요 (예: やまだ たろう)。');
      return false;
    }
    setNameKanaError('');
    return true;
  };

  const handleCheckEmail = async () => {
    if (!formData.email) {
      setEmailError('メールアドレスを入力してください。\n이메일 주소를 입력해 주세요.');
      return;
    }

    if (!validateEmail(formData.email)) {
      return;
    }

    setIsCheckingEmail(true);
    try {
      const { available } = await authApi.checkEmailAvailability(formData.email);
      if (available) {
        setEmailError('このメールアドレスは使用可能です。\n이 이메일 주소는 사용 가능합니다。');
      } else {
        setEmailError('このメールアドレスは既に使用されています。\n이 이메일 주소는 이미 사용 중입니다。');
      }
    } catch (error) {
      setEmailError('メールアドレスの確認中にエラーが発生しました。\n이메일 주소 확인 중 오류가 발생했습니다。');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = [];
    if (!validateEmail(formData.email)) {
      errors.push('メールアドレス');
    }
    if (!validatePassword(formData.password)) {
      errors.push('パスワード');
    }
    if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
      errors.push('パスワード（確認用）');
    }
    if (!validateName(formData.lastName)) {
      errors.push('名前（漢字）');
    }
    if (!validateNameKana(formData.lastNameKana, formData.firstNameKana)) {
      errors.push('名前（ふりがな）');
    }
    if (!formData.agreeToTerms) {
      errors.push('利用規約への同意');
    }

    if (errors.length > 0) {
      setFormError(`以下の項目をご確認ください：\n${errors.join('、')}\n\n다음 항목을 확인해 주세요：\n${errors.join(', ')}`);
      return;
    }
    setFormError('');

    setIsLoading(true);
    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.lastName,
        firstNameKana: formData.firstNameKana,
        lastNameKana: formData.lastNameKana
      };
      
      await authApi.signup(signupData);
      alert('会員登録が完了しました。ログインしてください。\n회원 가입이 완료되었습니다. 로그인해 주세요。');
      navigate('/login');
    } catch (error: any) {
      if (error.response?.status === 409) {
        setEmailError('このメールアドレスは既に登録されています。\n이 이메일 주소는 이미 등록되었습니다。');
      } else {
        setPasswordError('会員登録に失敗しました。もう一度お試しください。\n회원 가입에 실패했습니다. 다시 시도해 주세요。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = 
    formData.email && 
    formData.password && 
    formData.confirmPassword && 
    formData.agreeToTerms && 
    !emailError && 
    !passwordError && 
    !confirmPasswordError &&
    !nameError && 
    !nameKanaError;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/login')}>
          <RotatedArrow>
            <ArrowIcon />
          </RotatedArrow>
        </BackButton>
        <Title>会員登録</Title>
      </Header>
      <ContentArea>
        <Logo src={logo} alt="COCO Logo" />
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>メールアドレス<Required>*</Required></Label>
            <EmailInputContainer>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="メールアドレス"
                required
              />
              <CheckEmailButton
                type="button"
                onClick={handleCheckEmail}
                disabled={isCheckingEmail}
              >
                {isCheckingEmail ? '確認中...' : '重複確認'}
              </CheckEmailButton>
            </EmailInputContainer>
            {emailError && <ErrorMessage style={{ color: emailError.includes('使用可能') || emailError.includes('사용 가능') ? '#4CAF50' : '#FF6EA5' }}>{emailError}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>名前（漢字）<Required>*</Required></Label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="名前"
              required
            />
            {nameError && <ErrorMessage>{nameError}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>名前（ふりがな）<Required>*</Required></Label>
            <NameKanaContainer>
              <Input
                type="text"
                name="lastNameKana"
                value={formData.lastNameKana}
                onChange={handleInputChange}
                placeholder="セイ"
                required
              />
              <Input
                type="text"
                name="firstNameKana"
                value={formData.firstNameKana}
                onChange={handleInputChange}
                placeholder="メイ"
                required
              />
            </NameKanaContainer>
            {nameKanaError && <ErrorMessage>{nameKanaError}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>パスワード<Required>*</Required></Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="パスワード"
              required
            />
            {passwordError && <ErrorMessage style={{ whiteSpace: 'pre-line' }}>{passwordError}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>パスワード（確認用）<Required>*</Required></Label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="パスワード（確認用）"
              required
            />
            {confirmPasswordError && <ErrorMessage>{confirmPasswordError}</ErrorMessage>}
          </InputGroup>

          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
            />
            <CheckboxLabel>
              利用規約、個人情報保護方針およびオープンドリームカンパニーからのメールマガジンの受信に同意します。\n이용약관, 개인정보 보호정책 및 오픈드림컴퍼니로부터의 이메일 뉴스레터 수신에 동의합니다。
            </CheckboxLabel>
          </CheckboxGroup>

          <RegisterButton 
            type="submit" 
            disabled={!isFormValid || isLoading}
            style={{ marginTop: '20px' }}
          >
            {isLoading ? '登録中...' : '会員登録'}
          </RegisterButton>
          {formError && (
            <ErrorMessage style={{ marginTop: '10px', whiteSpace: 'pre-line', textAlign: 'left' }}>
              {formError}
            </ErrorMessage>
          )}
        </Form>
      </ContentArea>
    </PageContainer>
  );
};

const NameKanaContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  
  ${Input} {
    flex: 1;
  }
`;

const EmailInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;

  ${Input} {
    flex: 1;
  }
`;

const Required = styled.span`
  color: #FF6EA5;
  margin-left: 0.25rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Checkbox = styled.input`
  margin-top: 0.25rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #1e293b;
  line-height: 1.4;
`;

const CheckEmailButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #FF6EA5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: #FF5B98;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const RegisterButton = styled(LoginButton)``;

export default RegisterPage;