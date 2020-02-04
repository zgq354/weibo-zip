import React from 'react';
import { WeiboStatus } from '../../types';

export default function WeiboStatusContent({ status }: {
  status: WeiboStatus;
}) {
  console.log('-->', status);
  return (
    <div>
    test  
    </div>
  );
}
