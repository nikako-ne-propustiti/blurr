import React from 'react';
import './AccountTextInput.css';

interface Props {
    name: string;
    placeholder?: string;
    length?: number;
    isPassword?: boolean
}

const AccountTextInput: React.FC<Props> = ({ name, placeholder, length, isPassword }) => {
    return (
        <p className="account-text-input"><input type={isPassword ? 'password' : 'text'} name={name} placeholder={placeholder} maxLength={length}></input></p>
    );
}

export default AccountTextInput;
