import styled from 'styled-components';

export const Container = styled.div`
  background-color: #fff;
  padding: 0 1rem;
`;

export const SectionTitle = styled.h2`
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 1rem;
`;

export const SettingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

export const SettingText = styled.span`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
`;

export const ArrowIcon = styled.span`
  color: black;
`;