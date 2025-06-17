import React from "react";
import styled from 'styled-components';

interface ButtonProps {
    width?: string;
    height?: string;
    background?: string;
    color?: string;
    radius?: string;
    margin?: string;
    padding?: string;
    fontSize?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const StyledButton = styled.button<ButtonProps>`
    width: ${props => props.width || '100%'};
    height: ${props => props.height || '100%'};
    background-color: ${props => props.background || '#67A8E3'};
    color: ${props => props.color || '#ffffff'};
    border-radius: ${props => props.radius || '0'};
    margin: ${props => props.margin || '1.25rem 0'};
    padding: ${props => props.padding || '0.5rem 1rem'};
    font-size: ${props => props.fontSize || '1rem'};
    border: none;
    outline: none;
    transition: background-color 0.3s ease;
    white-space: nowrap;
    
    &:hover {
        cursor: pointer;
        background-color: #A8E8FF;
        color: ${props => props.color || '#ffffff'};
    }
`;

const Button: React.FC<ButtonProps> = (props) => {
    return <StyledButton {...props}>{props.children}</StyledButton>;
};

export default Button;