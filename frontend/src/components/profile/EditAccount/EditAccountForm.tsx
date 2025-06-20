import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '../../../apis/masterAuth';
import {
  FormContainer,
  Header,
  BackButton,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  RotatedArrow
} from '../../../styles/profile/EditAccount/EditForm.styles';
import ArrowIcon from '../../icons/ArrowIcon';

interface FormData {
  email: string;
  name: string;
  phone: string;
  lineId: string;
}

const EditAccountForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    phone: '',
    lineId: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await authApi.getCurrentUser();
        if (user) {
          setFormData(prevData => ({
            ...prevData,
            email: user.email || '',
            name: user.name || '',
            phone: user.phoneNumber || '',
            lineId: user.lineId || '',
          }));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        navigate('/login');
      }
    };

    loadUserData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update user information
    console.log('Form submitted:', formData);
    navigate('/profile/my-accounts');
  };

  return (
    <FormContainer>
      <Header>
        <BackButton onClick={() => navigate('/profile/my-account')}>
            <RotatedArrow>
                <ArrowIcon />
            </RotatedArrow>
        </BackButton>
        <Title>メールアドレスの変更</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>メールアドレス</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            disabled
          />
        </FormGroup>

        <FormGroup>
          <Label>氏名</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="氏名を入力してください。"
          />
        </FormGroup>

        <FormGroup>
          <Label>携帯電話番号</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="000-0000-0000"
          />
        </FormGroup>

        <FormGroup>
          <Label>LINE ID</Label>
          <Input
            type="text"
            name="lineId"
            value={formData.lineId}
            onChange={handleChange}
            placeholder="LINE IDを入力してください。"
          />
        </FormGroup>

        <SubmitButton type="submit">
          保存する
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default EditAccountForm;