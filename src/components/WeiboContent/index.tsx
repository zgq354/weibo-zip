import React from "react";
import classnames from "classnames";
import ReactPlayer from "react-player";
import { WeiboStatus } from "../../types";

import "./index.scss";

function processWeiboHTML(text: string) {
  text = text.replace(/href='\/n\//g, "href='https://m.weibo.cn/n/");
  const dom = document.createElement("div");
  dom.innerHTML = text;
  Array.prototype.forEach.call(dom.getElementsByTagName("a"), elem => {
    elem.target = "_blank";
  });
  return dom.innerHTML;
}

export default function WeiboStatusContent({
  status,
  retweeted = false
}: {
  status: WeiboStatus;
  retweeted?: boolean;
}) {
  const {
    bid,
    created_at,
    text,
    user: { id: uid, screen_name },
    pics,
    page_info,
    retweeted_status
  } = status;
  const timeText = new Date(created_at)
    .toJSON()
    .replace("T", " ")
    .split(".")[0];
  return (
    <div
      className={classnames("weibo-content", {
        original: !retweeted,
        retweeted
      })}
    >
      <div className="weibo-head">
        <div className="screen-name">
          <a href={`https://weibo.com/${uid}`} target="_blank">
            {"@"}
            {screen_name}
          </a>
        </div>
        {!retweeted && <time>{timeText}</time>}
        <a
          className="orig-link"
          href={`https://weibo.com/${uid}/${bid}`}
          target="_blank"
        >
          原文
        </a>
      </div>
      <div className="weibo-text">
        <span
          className="content"
          dangerouslySetInnerHTML={{
            __html: processWeiboHTML(text)
          }}
        ></span>
      </div>
      {page_info?.media_info && (
        <ReactPlayer
          className="video-player"
          url={page_info.media_info.stream_url_hd}
          controls
        />
      )}
      {pics && (
        <div className="imgs">
          {pics.map(item => (
            <React.Fragment key={item.large.url}>
              <img src={item.large.url} />
              <br />
            </React.Fragment>
          ))}
        </div>
      )}
      {retweeted && <time className="footer-time">{timeText}</time>}
      {retweeted_status && (
        <WeiboStatusContent status={retweeted_status} retweeted />
      )}
    </div>
  );
}
