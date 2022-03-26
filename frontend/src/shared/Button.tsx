import React, {MouseEventHandler} from 'react';
import './Button.css';

interface Props {
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLInputElement>,
    text: string
}

const Button: React.FC<Props> = ({disabled, onClick, text}) => {
    return <input type="submit" className="button" value={text} onClick={onClick} disabled={disabled}></input>;
}

export default Button;
