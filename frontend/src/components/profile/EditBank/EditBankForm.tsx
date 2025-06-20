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

interface BankFormData {
  accountHolder: string;
  bankName: string;
  branchCode: string;
  accountNumber: string;
  accountType: string;
  postalCode: string;
  address: string;
  phoneNumber: string;
}

const EditBankForm: React.FC = () => {
  const [formData, setFormData] = useState<BankFormData>({
    accountHolder: '',
    bankName: '',
    branchCode: '',
    accountNumber: '',
    accountType: '',
    postalCode: '',
    address: '',
    phoneNumber: ''
  });

  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    // Check if all required fields are filled
    const requiredFields = ['accountHolder', 'bankName', 'branchCode', 'accountNumber', 'accountType', 'postalCode', 'address', 'phoneNumber'];
    const isComplete = requiredFields.every(field => formData[field as keyof typeof formData].trim() !== '');
    setIsFormComplete(isComplete);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>預金名義</Label>
        <Input
          type="text"
          name="accountHolder"
          value={formData.accountHolder}
          onChange={handleChange}
          placeholder="例：ヤマダタロウ"
        />
      </FormGroup>
      <FormGroup>
        <Label>銀行名</Label>
        <Input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="例：みずほ銀行"
        />
      </FormGroup>
      <FormGroup>
        <Label>支店コード</Label>
        <Input
          type="text"
          name="branchCode"
          value={formData.branchCode}
          onChange={handleChange}
          placeholder="例：001"
        />
      </FormGroup>
      <FormGroup>
        <Label>口座番号</Label>
        <Input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="例：1234567"
        />
      </FormGroup>
      <FormGroup>
        <Label>口座種別</Label>
        <Input
          type="text"
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
          placeholder="例：普通"
        />
      </FormGroup>
      <FormGroup>
        <Label>郵便番号</Label>
        <Input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="例：123-4567"
        />
      </FormGroup>
      <FormGroup>
        <Label>住所</Label>
        <Input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="例：東京都渋谷区渋谷1-1-1"
        />
      </FormGroup>
      <FormGroup>
        <Label>電話番号</Label>
        <Input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="例：03-1234-5678"
        />
      </FormGroup>
      <NoticeText>
        ※ 上記の情報は、海外送金のため銀行で必須となっております。ご理解とご協力のほど、よろしくお願いいたします。
      </NoticeText>
      <NoticeText>
        ※ 海外送金の場合、入金完了から着金までに1～2週間ほどかかる場合がございます。予めご了承くださいませ。
      </NoticeText>
      <ButtonContainer>
        <SubmitButton type="submit" disabled={!isFormComplete}>
          保存する
        </SubmitButton>
      </ButtonContainer>
    </Form>
  );
};

export default EditBankForm;