import React, {MouseEventHandler} from 'react';
import './Button.css';

interface Props {
    onClick?: MouseEventHandler<HTMLInputElement>,
    text: string
}

const Button: React.FC<Props> = ({onClick, text}) => {
    return (
        <input type="submit" className="button" value={text} onClick={onClick}></input>
    );
}

export default Button;
