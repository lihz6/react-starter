import React, { ReactNode } from 'react';

import './style.scss';

export interface UxSpinProps {
  spinning: boolean;
  children: ReactNode;
}

export default function UxSpin({}: UxSpinProps) {
  return <div className="ux-spin-main">UxSpin</div>;
}
