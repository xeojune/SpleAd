import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '../../../apis/masterAuth';
import styled from 'styled-components';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  lineId?: string;
}

const Container = styled.div`
  background: white;
  padding: 1rem;
  margin-top: 1rem;
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

const AccountInfo: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
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
          email: user.email,
          phone: user.phoneNumber,
          lineId: user.lineId
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
        アカウント情報
        <EditButton onClick={() => navigate('/profile/my-account/edit-account')}>編集</EditButton>
      </Title>
      <FormGroup>
        <Label>メールアドレス</Label>
        <Value>{userData.email}</Value>
      </FormGroup>
      <FormGroup>
        <Label>LINE ID</Label>
        <Value>{userData.lineId || '未設定'}</Value>
      </FormGroup>
    </Container>
  );
};

export default AccountInfo;