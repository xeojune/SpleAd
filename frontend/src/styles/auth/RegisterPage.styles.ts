import styled from "styled-components";
import { Input } from "./LoginPage.styles";

export const AddressButton = styled.button`
  padding: 12px 24px;
  background-color: #FF69B4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #FF1493;
  }
`;

export const AddressInputWrapper = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;

  ${Input} {
    flex: 2;
  }
`;

export const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e6e6e6;
  border-radius: 2px;
  margin-bottom: 24px;
`;

export const Progress = styled.div<{ step: number }>`
  width: ${props => props.step * 33.33}%;
  height: 100%;
  background: #FF69B4;
  border-radius: 2px;
  transition: width 0.3s ease;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;

  button {
    flex: 1;
  }
`;