import React from 'react';

import './Icon.css';
import 'material-icons/iconfont/material-icons.css';

interface Props {
    name: string;
}

const Icon: React.FC<Props> = ({name}) => {
    return <span className="material-icons" aria-hidden="true">{name}</span>
};

export default Icon;
