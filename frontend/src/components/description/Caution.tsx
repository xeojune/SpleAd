import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const Section = styled.div`
`;

const SectionHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  text-align: left;

  &:hover {
    opacity: 0.8;
  }
`;

const Arrow = styled.span<{ isOpen: boolean }>`
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease;
`;

const Content = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  padding: 0 0 1rem;
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const sections = [
  {
    title: '購入注意事項',
    content: '상품의 재판매는 금지되어 있습니다.'
  },
  {
    title: '複数アカウントの使用',
    content: '캠페인 마감 기간을 준수하지 않을 경우 패널티가 부과될 수 있습니다.'
  },
  {
    title: '転売',
    content: '부정한 방법으로 포인트를 수령할 경우 제재 대상이 됩니다.'
  },
  {
    title: 'キャンペーン期間内の投稿未完了',
    content: '캠페인 신청 후 단순 변심으로 인한 취소는 불가합니다.'
  },
  {
    title: '支給対象外',
    content: '작성하신 리뷰는 마케팅 및 광고 목적으로 활용될 수 있습니다.'
  },
  {
    title: '一方的なキャンペーン変更',
    content: ''
  },
  {
    title: 'マーケティングおよび広告活用',
    content: ''
  }
];

export const Caution: React.FC = () => {
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Container>
      <Title>注意事項</Title>
      {sections.map((section, index) => (
        <Section key={index}>
          <SectionHeader onClick={() => toggleSection(index)}>
            {section.title}
            <Arrow isOpen={openSections.includes(index)}>▼</Arrow>
          </SectionHeader>
          <Content isOpen={openSections.includes(index)}>
            {section.content}
          </Content>
        </Section>
      ))}
    </Container>
  );
};