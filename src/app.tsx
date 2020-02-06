import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
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
          <div
            className={classnames("dropzone", {
              "has-weibo": !!weiboData
            })}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <>
                <p>
                  Drop a{" "}
                  <a
                    href="https://github.com/zgq354/weibo-zip"
                    target="_blank"
                    onClick={e => e.stopPropagation()}
                  >
                    Weibo-Zip
                  </a>{" "}
                  file here, or click to select a file
                </p>
                {!weiboData && (
                  <p className="sample">
                    ... or download & try these sample files: <br />{" "}
                    <a
                      href="./examples/weibo-example-text.zip"
                      target="_blank"
                      onClick={e => e.stopPropagation()}
                    >
                      text
                    </a>{" "}
                    <a
                      href="./examples/weibo-example-repost.zip"
                      target="_blank"
                      onClick={e => e.stopPropagation()}
                    >
                      repost
                    </a>{" "}
                    <a
                      href="./examples/weibo-example-video.zip"
                      target="_blank"
                      onClick={e => e.stopPropagation()}
                    >
                      video
                    </a>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        {errMsg && (
          <div className="err-msg">
            <p>{typeof errMsg === "object" ? errMsg.message : errMsg}</p>
          </div>
        )}
        {weiboData ? <WeiboContent status={weiboData} /> : null}
        {/* {weiboData ? <WeiboContent status={weiboData} /> : <EmptyContent />} */}
      </div>
      <div className="footer">
        © 2020{" "}
        <a href="https://github.com/zgq354" target="_blank">
          zgq354
        </a>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
