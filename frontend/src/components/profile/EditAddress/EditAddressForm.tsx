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
  lastName: string;
  lastNameKana: string;
  postCode: string;
  address: string;
  phoneNumber: string;
}

const EditAddressForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    lastName: '',
    lastNameKana: '',
    postCode: '',
    address: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await authApi.getCurrentUser();
        if (user) {
          setFormData(prevData => ({
            ...prevData,
            lastName: user.recipientName?.split(' ')[0] || '',
            lastNameKana: user.recipientNameKana?.split(' ')[0] || '',
            postCode: user.postCode || '',
            address: user.address || '',
            phoneNumber: user.recipientPhoneNumber || '',
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
    navigate('/profile/my-account');
  };

  return (
    <FormContainer>
      <Header>
        <BackButton onClick={() => navigate('/profile/my-account')}>
          <RotatedArrow>
            <ArrowIcon />
          </RotatedArrow>
        </BackButton>
        <Title>住所変更</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>お名前（漢字）</Label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="お名前（漢字）"
          />
        </FormGroup>

        <FormGroup>
          <Label>お名前（ふりがな）</Label>
          <Input
            type="text"
            name="lastNameKana"
            value={formData.lastNameKana}
            onChange={handleChange}
            placeholder="お名前（ふりがな）"
          />
        </FormGroup>

        <FormGroup>
          <Label>郵便番号</Label>
          <Input
            type="text"
            name="postCode"
            value={formData.postCode}
            onChange={handleChange}
            placeholder="000-0000"
          />
        </FormGroup>

        <FormGroup>
          <Label>宅配便の受取住所</Label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="宅配便の受取住所"
          />
        </FormGroup>

        <FormGroup>
          <Label>携帯電話番号</Label>
          <Input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="000-0000-0000"
          />
        </FormGroup>

        <SubmitButton type="submit">
          保存する
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default EditAddressForm;
