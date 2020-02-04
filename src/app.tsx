import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';

import { WeiboUnpacker } from './weibo-unpacker';
import { WeiboStatus } from './types';
import WeiboContent from './components/WeiboContent';

let weiboUnpacker: WeiboUnpacker | null = null;

function App() {
  const [weiboData, setWeiboData] = useState<WeiboStatus | null>(null);
  const [inputVal, setInputVal] = useState<string>('');

  return (
    <div className="app">
      <h1>微博查看器</h1>
      <div>
        <input onChange={inputOnChange} value={inputVal} type="file" />
      </div>
      { weiboData && <WeiboContent status={weiboData} /> }
    </div>
  );

  async function inputOnChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const target = ev.currentTarget;
    const file = target.files![0];

    weiboUnpacker && weiboUnpacker.revoke();
    weiboUnpacker = new WeiboUnpacker();
    setWeiboData(await weiboUnpacker.load(file));
    setInputVal('');
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
