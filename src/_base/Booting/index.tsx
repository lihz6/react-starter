import React from 'react';
import { Spin } from 'antd';

export default function Booting() {
  return (
    <Spin
      spinning
      size="large"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        width: '100%',
      }}
    />
  );
}
