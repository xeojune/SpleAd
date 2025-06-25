import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { authApi } from '../../../apis/masterAuth';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  min-height: calc(100vh - 300px);
  position: relative;
  padding-bottom: 80px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #1e293b;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #FF6EA5;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 0;
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.disabled ? '#e2e8f0' : '#FF6EA5'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.disabled ? '#e2e8f0' : '#FF6EA5'};
  }
`;

const NoticeText = styled.span`
  color: #64748b;
  font-size: 0.75rem;
  margin-top: 1rem;
`;

const EditPaypalForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    setIsFormComplete(email.trim() !== '');
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;
    
    try {
      console.log('Submitting PayPal email:', email);
      const response = await authApi.updateUser({
        // Clear all bank info
        accountHolderLastKana: '',
        accountHolderFirstKana: '',
        bankName: '',  // This is critical as it's used as the check in MyBankPage
        branchCode: '',
        accountType: '',
        accountNumber: '',
        accountPostalCode: '',
        accountAddress: '',
        accountPhone: '',
        // Set PayPal email
        paypalEmail: email.trim()
      });
      console.log('PayPal update response:', response);

      // Make sure we wait for the update to complete before navigating
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate('/profile/my-bank');
    } catch (error) {
      console.error('Failed to update PayPal information:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>PayPalメールアドレス</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="例：example@email.com"
        />
      </FormGroup>
      <NoticeText>
        ※ PayPalを選択される場合は、メールアドレスをご記入ください。 
      </NoticeText>
      <ButtonContainer>
        <SubmitButton type="submit" disabled={!isFormComplete}>
          保存する
        </SubmitButton>
      </ButtonContainer>
    </Form>
  );
};

export default EditPaypalForm;
