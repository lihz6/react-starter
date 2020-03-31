import React, { ReactNode } from 'react';
import { Spin } from 'antd';

export interface UxSpinProps {
  spinning: boolean;
  children: ReactNode;
}

export default function UxSpin({ spinning, children }: UxSpinProps) {
  if (spinning) {
    return (
      <Spin
        spinning
        style={{
          minHeight: '6.2em',
        }}>
        {/* HACK: to mount children and hide the broken view. */}
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </Spin>
    );
  }
  return children as JSX.Element;
}
