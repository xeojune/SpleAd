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
  lineId: string;
}

const EditAccountForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.updateUser({
        lineId: formData.lineId,
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
        <Title>アカウント編集</Title>
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