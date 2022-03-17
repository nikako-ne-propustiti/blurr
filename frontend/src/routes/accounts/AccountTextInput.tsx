import React from 'react';
import './AccountTextInput.css';

interface Props {
    name: string,
    placeholder?: string
}

const AccountTextInput: React.FC<Props> = ({name, placeholder}) => {
    return (
        <p className="account-text-input"><input type="text" name={name} placeholder={placeholder}></input></p>
    );
}

export default AccountTextInput;
