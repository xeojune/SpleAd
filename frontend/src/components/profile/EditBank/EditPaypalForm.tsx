import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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
  const [email, setEmail] = useState('');
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    setIsFormComplete(email.trim() !== '');
  }, [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;
    console.log('PayPal email submitted:', email);
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
