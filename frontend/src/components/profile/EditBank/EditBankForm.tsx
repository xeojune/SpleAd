import React, { useState, useMemo } from 'react';
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
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &::placeholder {
    color: #999;
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

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.active ? '#FF6EA5' : '#e2e8f0'};
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? '#FF6EA5' : '#e2e8f0'};
  }
`;

const KanaInputGroup = styled.div`
  display: flex;
  gap: 10px;
`;

interface BankFormData {
  accountHolderLastKana: string;
  accountHolderFirstKana: string;
  bankName: string;
  branchCode: string;
  accountType: string;
  accountNumber: string;
  accountPostalCode: string;
  accountAddress: string;
  accountPhone: string;
}

interface PaypalFormData {
  paypalEmail: string;
}

type PaymentMethod = 'bank' | 'paypal';

const EditBankForm: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank');
  const [bankFormData, setBankFormData] = useState<BankFormData>({
    accountHolderLastKana: '',
    accountHolderFirstKana: '',
    bankName: '',
    branchCode: '',
    accountType: '',
    accountNumber: '',
    accountPostalCode: '',
    accountAddress: '',
    accountPhone: ''
  });
  const [paypalFormData, setPaypalFormData] = useState<PaypalFormData>({
    paypalEmail: ''
  });

  const isFormComplete = useMemo(() => {
    if (paymentMethod === 'bank') {
      return Object.values(bankFormData).every(value => value.trim() !== '');
    } else {
      return paypalFormData.paypalEmail.trim() !== '';
    }
  }, [paymentMethod, bankFormData, paypalFormData]);

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaypalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log('Setting PayPal email to:', value);
    setPaypalFormData({ paypalEmail: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;
    
    try {
      if (paymentMethod === 'bank') {
        // Clear PayPal email and set bank info
        console.log('Submitting bank info:', bankFormData);
        const response = await authApi.updateUser({
          accountHolderLastKana: bankFormData.accountHolderLastKana,
          accountHolderFirstKana: bankFormData.accountHolderFirstKana,
          bankName: bankFormData.bankName,
          branchCode: bankFormData.branchCode,
          accountType: bankFormData.accountType,
          accountNumber: bankFormData.accountNumber,
          accountPostalCode: bankFormData.accountPostalCode,
          accountAddress: bankFormData.accountAddress,
          accountPhone: bankFormData.accountPhone,
          paypalEmail: ''  // Clear PayPal
        });
        console.log('Bank update response:', response);
      } else {
        // Clear bank info and set PayPal
        console.log('Submitting PayPal info:', paypalFormData);
        if (!paypalFormData.paypalEmail.trim()) {
          console.error('PayPal email is empty');
          return;
        }

        const response = await authApi.updateUser({
          accountHolderLastKana: '',
          accountHolderFirstKana: '',
          bankName: '',  // This is critical as it's used as the check in MyBankPage
          branchCode: '',
          accountType: '',
          accountNumber: '',
          accountPostalCode: '',
          accountAddress: '',
          accountPhone: '',
          paypalEmail: paypalFormData.paypalEmail.trim()
        });
        console.log('PayPal update response:', response);
      }

      // Make sure we wait for the update to complete before navigating
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify the update worked
      const updatedUser = await authApi.getCurrentUser();
      console.log('Updated user data:', updatedUser);
      
      navigate('/profile/my-bank');
    } catch (error) {
      console.error('Failed to update payment information:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {paymentMethod === 'bank' ? (
        <>
          <FormGroup>
            <Label>口座名義（フリガナ）</Label>
            <KanaInputGroup>
              <Input
                type="text"
                name="accountHolderLastKana"
                value={bankFormData.accountHolderLastKana}
                onChange={handleBankChange}
                placeholder="セイ"
              />
              <Input
                type="text"
                name="accountHolderFirstKana"
                value={bankFormData.accountHolderFirstKana}
                onChange={handleBankChange}
                placeholder="メイ"
              />
            </KanaInputGroup>
          </FormGroup>
          <FormGroup>
            <Label>銀行名</Label>
            <Input
              type="text"
              name="bankName"
              value={bankFormData.bankName}
              onChange={handleBankChange}
              placeholder="例：みずほ銀行"
            />
          </FormGroup>
          <FormGroup>
            <Label>支店コード</Label>
            <Input
              type="text"
              name="branchCode"
              value={bankFormData.branchCode}
              onChange={handleBankChange}
              placeholder="例：001"
            />
          </FormGroup>
          <FormGroup>
            <Label>口座種別</Label>
            <Input
              type="text"
              name="accountType"
              value={bankFormData.accountType}
              onChange={handleBankChange}
              placeholder="例：普通"
            />
          </FormGroup>
          <FormGroup>
            <Label>口座番号</Label>
            <Input
              type="text"
              name="accountNumber"
              value={bankFormData.accountNumber}
              onChange={handleBankChange}
              placeholder="例：1234567"
            />
          </FormGroup>
          <FormGroup>
            <Label>郵便番号</Label>
            <Input
              type="text"
              name="accountPostalCode"
              value={bankFormData.accountPostalCode}
              onChange={handleBankChange}
              placeholder="例：123-4567"
            />
          </FormGroup>
          <FormGroup>
            <Label>住所</Label>
            <Input
              type="text"
              name="accountAddress"
              value={bankFormData.accountAddress}
              onChange={handleBankChange}
              placeholder="例：東京都渋谷区..."
            />
          </FormGroup>
          <FormGroup>
            <Label>電話番号</Label>
            <Input
              type="text"
              name="accountPhone"
              value={bankFormData.accountPhone}
              onChange={handleBankChange}
              placeholder="例：03-1234-5678"
            />
          </FormGroup>
        </>
      ) : (
        <FormGroup>
          <Label>PayPalメールアドレス</Label>
          <Input
            type="email"
            name="paypalEmail"
            value={paypalFormData.paypalEmail}
            onChange={handlePaypalChange}
            placeholder="example@email.com"
          />
        </FormGroup>
      )}

      <NoticeText>
        ※ 上記の情報は、海外送金のため銀行で必須となっております。ご理解とご協力のほど、よろしくお願いいたします。
      </NoticeText>
      <NoticeText>
        ※ 海外送金の場合、入金完了から着金までに1週間程度かかる場合がございます。
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