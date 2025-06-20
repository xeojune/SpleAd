import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 500;
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 1rem;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #1e293b;
  width: 100%;
  background-color: #fff;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#3b82f6'};
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button<{ isValid: boolean }>`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.isValid ? '#3b82f6' : '#f1f5f9'};
  border: none;
  border-radius: 0.5rem;
  color: ${props => props.isValid ? '#ffffff' : '#1e293b'};
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.isValid ? 'pointer' : 'not-allowed'};
  margin-top: 2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.isValid ? '#2563eb' : '#f1f5f9'};
  }
`;

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const EditPasswordForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = '現在のパスワードを入力してください。';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = '新しいパスワードを入力してください。';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'パスワードは8文字以上で入力してください。';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.newPassword)) {
      newErrors.newPassword = '半角英数字を組み合わせて入力してください。';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '確認用パスワードを入力してください。';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません。';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      // TODO: Add API call to update password
      console.log('Password update successful');
    } catch (error) {
      console.error('Failed to update password:', error);
      setErrors(prev => ({
        ...prev,
        currentPassword: 'パスワードの更新に失敗しました。'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = 
    formData.currentPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    Object.keys(errors).length === 0;

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label>現在のパスワード</Label>
        <Input
          type="password"
          name="currentPassword"
          placeholder="現在のパスワードで入力してください。"
          value={formData.currentPassword}
          onChange={handleChange}
          hasError={!!errors.currentPassword}
        />
        {errors.currentPassword && (
          <ErrorText>{errors.currentPassword}</ErrorText>
        )}
      </FormGroup>
      <FormGroup>
        <Label>新しいパスワード</Label>
        <Input
          type="password"
          name="newPassword"
          placeholder="半角英数字（組み合わせ）で入力してください。"
          value={formData.newPassword}
          onChange={handleChange}
          hasError={!!errors.newPassword}
        />
        {errors.newPassword && (
          <ErrorText>{errors.newPassword}</ErrorText>
        )}
      </FormGroup>
      <FormGroup>
        <Label>パスワードの確認</Label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="確認のため、もう一度入力してください。"
          value={formData.confirmPassword}
          onChange={handleChange}
          hasError={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <ErrorText>{errors.confirmPassword}</ErrorText>
        )}
      </FormGroup>
      <SubmitButton 
        type="submit" 
        isValid={isFormValid}
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? '更新中...' : '変更する'}
      </SubmitButton>
    </FormContainer>
  );
};

export default EditPasswordForm;