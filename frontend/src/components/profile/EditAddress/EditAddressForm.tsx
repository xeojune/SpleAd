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
  name: string;
  firstNameKana: string;
  lastNameKana: string;
  postCode: string;
  address: string;
  phoneNumber: string;
}

const EditAddressForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    firstNameKana: '',
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
            name: user.name || '',
            firstNameKana: user.firstNameKana || '',
            lastNameKana: user.lastNameKana || '',
            postCode: user.postCode || '',
            address: user.address || '',
            phoneNumber: user.phoneNumber || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.updateUser({
        name: formData.name,
        firstNameKana: formData.firstNameKana,
        lastNameKana: formData.lastNameKana,
        postCode: formData.postCode,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
      });
      navigate('/profile/my-account');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <FormContainer>
      <Header>
        <BackButton onClick={() => navigate('/profile/my-account')}>
          <RotatedArrow>
            <ArrowIcon />
          </RotatedArrow>
        </BackButton>
        <Title>配送先住所の編集</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
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
          <Label>氏名（フリガナ）</Label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input
              type="text"
              name="lastNameKana"
              value={formData.lastNameKana}
              onChange={handleChange}
              placeholder="セイ"
              style={{ width: '50%' }}
            />
            <Input
              type="text"
              name="firstNameKana"
              value={formData.firstNameKana}
              onChange={handleChange}
              placeholder="メイ"
              style={{ width: '50%' }}
            />
          </div>
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
