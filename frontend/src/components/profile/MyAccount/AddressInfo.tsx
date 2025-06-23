import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { authApi } from '../../../apis/masterAuth';

interface UserAddressData {
  name: string;
  firstNameKana: string;
  lastNameKana: string;
  email: string;
  phoneNumber?: string;
  postCode?: string;
  address?: string;
}

const Container = styled.div`
  background: white;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditButton = styled.button`
  padding: 0.25rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: white;
  color: #64748b;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Value = styled.span`
  width: 100%;
  font-size: 1rem;
  color: #7d8cae;
`;

const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return '未設定';
  
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as 010-1234-5678
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  // If the number doesn't match the expected format, return as is
  return phone;
};

const AddressInfo: React.FC = () => {
  const [userData, setUserData] = useState<UserAddressData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await authApi.getCurrentUser();
        if (!user?.name || !user?.email) {
          navigate('/login');
          return;
        }
        setUserData({
          name: user.name,
          firstNameKana: user.firstNameKana || '',
          lastNameKana: user.lastNameKana || '',
          email: user.email,
          phoneNumber: user.phoneNumber,
          postCode: user.postCode,
          address: user.address
        });
      } catch (error) {
        console.error('Failed to load user data:', error);
        navigate('/login');
      }
    };

    loadUserData();
  }, [navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Title>
        お届け先情報
        <EditButton onClick={() => navigate('/profile/edit-address')}>編集</EditButton>
      </Title>
      <FormGroup>
        <Label>お名前（漢字）</Label>
        <Value>{userData.name || '未設定'}</Value>
      </FormGroup>
      <FormGroup>
        <Label>お名前（ふりがな）</Label>
        <Value>
          {userData.lastNameKana && userData.firstNameKana 
            ? `${userData.lastNameKana} ${userData.firstNameKana}`
            : '未設定'
          }
        </Value>
      </FormGroup>
      <FormGroup>
        <Label>郵便番号</Label>
        <Value>{userData.postCode || '未設定'}</Value>
      </FormGroup>
      <FormGroup>
        <Label>宅配便の受取住所</Label>
        <Value>{userData.address || '未設定'}</Value>
      </FormGroup>
      <FormGroup>
        <Label>携帯電話番号</Label>
        <Value>{userData.phoneNumber || '未設定'}</Value>
      </FormGroup>
    </Container>
  );
};

export default AddressInfo;