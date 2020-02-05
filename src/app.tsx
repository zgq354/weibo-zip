import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import { useDropzone } from "react-dropzone";

import { WeiboUnpacker } from "./weibo-unpacker";
import { WeiboStatus } from "./types";
import WeiboContent from "./components/WeiboContent";

import "./app.scss";

let weiboUnpacker: WeiboUnpacker | null = null;

function App() {
  const [weiboData, setWeiboData] = useState<WeiboStatus | null>(null);
  const [errMsg, setErrMsg] = useState<string | Error>("");
  const onDrop = useCallback(async files => {
    const file = files[0];
    const newWeiboUnpacker = new WeiboUnpacker();
    try {
      setWeiboData(await newWeiboUnpacker.load(file));
      setErrMsg("");
      weiboUnpacker && weiboUnpacker.revoke();
      weiboUnpacker = newWeiboUnpacker;
    } catch (err) {
      setErrMsg(err);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  return (
    <div className="app">
      <div className="container">
        <h1 className="site-tt">Weibo-Zip Viewer</h1>
        <div className="file-area">
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop a Weibo-Zip file here, or click to select</p>
            )}
          </div>
        </div>
        {errMsg && (
          <div className="err-msg">
            <p>{typeof errMsg === "object" ? errMsg.message : errMsg}</p>
          </div>
        )}
        {weiboData && <WeiboContent status={weiboData} />}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
