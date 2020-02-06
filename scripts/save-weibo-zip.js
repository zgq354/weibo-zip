
// const corsProxyServer = '';
// cors anywhere URL: https://github.com/Rob--W/cors-anywhere/
const corsProxyServer = 'https://cors.proxy/';

async function fetchWeibo(url) {
  return await fetch(
    url,
    {
      credentials: "include",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "mweibo-pwa": "1",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "x-xsrf-token": getCookie('XSRF-TOKEN')
      },
      referrer:
        `https://m.weibo.cn/status/${$render_data.status.bid}?type=comment&jumpfrom=weibocom&sudaref=weibo.com`,
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors"
    }
  ).then(r => r.json());
}

async function fetchWeiboComments(max_id = 0, max_id_type = 0) {
  return await fetchWeibo(
    `https://m.weibo.cn/comments/hotflow?id=${$render_data.status.id}&mid=${$render_data.status.mid}&max_id=${max_id}&max_id_type=${max_id_type}`
  );
}

async function fetchWeiboReposts(page = 1) {
  return await fetchWeibo(
    `https://m.weibo.cn/api/statuses/repostTimeline?id=${$render_data.status.id}&page=${page}`
  );
}

async function loadLibrary(url) {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    document.body.appendChild(script);
  });
}

const serverOffset = new Date().getTimezoneOffset() / 60;

function parseTimeString(html, timeZone = -serverOffset) {
    let math;
    let date = new Date();
    if (/(\d+)分钟前/.exec(html)) {
        math = /(\d+)分钟前/.exec(html);
        date.setMinutes(date.getMinutes() - math[1]);
        date.setSeconds(0);
    } else if (/(\d+)小时前/.exec(html)) {
        math = /(\d+)小时前/.exec(html);
        date.setHours(date.getHours() - math[1]);
    } else if (/(\d+)天前/.exec(html)) {
        math = /(\d+)天前/.exec(html);
        date.setDate(date.getDate() - math[1]);
    } else if (/(\d+)月前/.exec(html)) {
        math = /(\d+)月前/.exec(html);
        date.setMonth(date.getMonth() - math[1]);
    } else if (/(\d+)年前/.exec(html)) {
        math = /(\d+)年前/.exec(html);
        date.setFullYear(date.getFullYear() - math[1]);
    } else if (/今天\s*(\d+):(\d+)/.exec(html)) {
        math = /今天\s*(\d+):(\d+)/.exec(html);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), math[1], math[2]);
    } else if (/昨天\s*(\d+):(\d+)/.exec(html)) {
        math = /昨天\s*(\d+):(\d+)/.exec(html);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, math[1], math[2]);
    } else if (/前天\s*(\d+):(\d+)/.exec(html)) {
        math = /前天\s*(\d+):(\d+)/.exec(html);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2, math[1], math[2]);
    } else if (/(\d+)年(\d+)月(\d+)日(\d+)时/.exec(html)) {
        math = /(\d+)年(\d+)月(\d+)日(\d+)时/.exec(html);
        date = new Date(parseInt(math[1]), parseInt(math[2]) - 1, parseInt(math[3]), parseInt(math[4]));
    } else if (/(\d+)年(\d+)月(\d+)日/.exec(html)) {
        math = /(\d+)年(\d+)月(\d+)日/.exec(html);
        date = new Date(parseInt(math[1]), parseInt(math[2]) - 1, parseInt(math[3]));
    } else if (/(\d+)-(\d+)-(\d+) (\d+):(\d+)/.exec(html)) {
        math = /(\d+)-(\d+)-(\d+) (\d+):(\d+)/.exec(html);
        date = new Date(math[1], parseInt(math[2]) - 1, math[3], math[4], math[5]);
    } else if (/(\d+)-(\d+) (\d+):(\d+)/.exec(html)) {
        math = /(\d+)-(\d+) (\d+):(\d+)/.exec(html);
        date = new Date(date.getFullYear(), parseInt(math[1]) - 1, math[2], math[3], math[4]);
    } else if (/(\d+)\/(\d+)\/(\d+)\s*(\d+):(\d+):(\d+)/.exec(html)) {
        math = /(\d+)\/(\d+)\/(\d+)\s*(\d+):(\d+):(\d+)/.exec(html);
        date = new Date(math[1], parseInt(math[2]) - 1, math[3], math[4], math[5], math[6]);
    } else if (/(\d+)\/(\d+)\/(\d+)\s*(\d+):(\d+)/.exec(html)) {
        math = /(\d+)\/(\d+)\/(\d+)\s*(\d+):(\d+)/.exec(html);
        date = new Date(math[1], parseInt(math[2]) - 1, math[3], math[4], math[5]);
    } else if (/(\d+)\/(\d+)\s*(\d+):(\d+)/.exec(html)) {
        math = /(\d+)\/(\d+)\s*(\d+):(\d+)/.exec(html);
        date = new Date(date.getFullYear(), parseInt(math[1]) - 1, math[2], math[3], math[4]);
    } else if (/(\d+)月(\d+)日 (\d+):(\d+)/.exec(html)) {
        math = /(\d+)月(\d+)日 (\d+):(\d+)/.exec(html);
        date = new Date(date.getFullYear(), parseInt(math[1]) - 1, math[2], math[3], math[4]);
    } else if (/(\d+)月(\d+)日/.exec(html)) {
        math = /(\d+)月(\d+)日/.exec(html);
        date = new Date(date.getFullYear(), parseInt(math[1]) - 1, math[2]);
    } else if (/(\d+)\/(\d+)/.exec(html)) {
        math = /(\d+)\/(\d+)/.exec(html);
        date = new Date(date.getFullYear(), parseInt(math[1]) - 1, math[2]);
    } else if (/(\d+)-(\d+)-(\d+)/.exec(html)) {
        math = /(\d+)-(\d+)-(\d+)/.exec(html);
        date = new Date(math[1], parseInt(math[2]) - 1, math[3]);
    } else if (/(\d+)-(\d+)/.exec(html)) {
        math = /(\d+)-(\d+)/.exec(html);
        date = new Date(date.getFullYear(), parseInt(math[1]) - 1, math[2]);
    } else if (/(\d+):(\d+)/.exec(html)) {
        math = /(\d+):(\d+)/.exec(html);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), math[1], math[2]);
    } else if (/刚刚/.exec(html)) {
        math = /刚刚/.exec(html);
    }

    if (math) {
        return new Date(date.getTime() - 60 * 60 * 1000 * (timeZone + serverOffset)).toUTCString();
    }
    return html;
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function wait() {
  await sleep(Math.floor(Math.random() * 500) + 300);
}

function getCookie(key) {
  return document.cookie
    .split("; ")
    .map(item => item.split("="))
    .reduce((accu, curr) => {
      accu[curr[0]] = curr[1];
      return accu;
    }, {})[key];
}

function uniqByKey(objArr, key) {
  return Object.values(objArr.reduce((accu, curr) => {
    accu[curr[key]] = curr;
    return accu;
  }, {}));
}

function saveStr(str, filename = '') {
  const blob = new Blob([str], {
    type: 'plain/text',
  });
  const objURL = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = filename || `result-${$render_data.status.bid}.txt`;
  a.href = objURL;
  a.click();
}

let flag = true;
function stop() {
  flag = false;
}

const maxInteractionPage = 2;
let commentsArray = [];
let max_id = 0;
let max_id_type = 0;
let cnt = 0;
let totalNum = 1;
async function getComments() {
  // 普通楼层
  flag = true;
  while (flag && totalNum > commentsArray.length && (cnt < maxInteractionPage)) {
    const res = await fetchWeiboComments(max_id, max_id_type);
    const { data: re } = res;
    if (!re) {
      console.log(res);
      break;
    }
    const { data, total_number } = re;
    commentsArray.push(...data);
    cnt++;
    console.log('comments page', cnt, 'added:', data.length, 'total:', commentsArray.length, '/', total_number);
    totalNum = total_number;
    max_id = re.max_id;
    max_id_type = re.max_id_type;
    await wait();
  }
  // 评论主体去重
  commentsArray = uniqByKey(commentsArray, 'id');
  console.log('comments step 1 done');
}

let repostPage = 1;
let repostsArray = [];
let repostTotal = 1;
async function getReposts() {
  flag = true;
  while (flag && repostsArray.length < repostTotal && (repostPage <= maxInteractionPage)) {
    console.log('fetching repost', repostPage, repostsArray.length, '/', repostTotal);
    const res = await fetchWeiboReposts(repostPage);
    const { data, msg } = res;
    if (!data) {
      console.log(res);
      break;
    }
    const { data: dataArr, total_number } = data;

    repostsArray.push(...dataArr.map(item => {
      return {
        ...item,
        created_at: parseTimeString(item.created_at),
      };
    }));

    repostTotal = total_number;
    repostPage++;
    await wait();
  }
  // 去重
  repostsArray = uniqByKey(repostsArray, 'id');
  console.log('repost done');
}

async function exportData() {
  const statusObj = $render_data.status;
  const statusDataBlob = new Blob([JSON.stringify(statusObj, false, 2)], {
    type: 'application/json',
  });

  const interactionObject = {
    repostsArray,
    commentsArray,
  };
  const interactionDataBlob = new Blob([JSON.stringify(interactionObject, false, 2)], {
    type: 'application/json',
  });

  // imgs
  const imgBlobList = [];
  if (statusObj.pics || (statusObj.retweeted_status && statusObj.retweeted_status.pics)) {
    const pics = [];
    pics.push(...(statusObj.pics || []), ...((statusObj.retweeted_status && statusObj.retweeted_status.pics) || []))
    for (let index = 0; index < pics.length; index++) {
      const { pid, url, large: { url: largeUrl } } = pics[index];
      console.log('fetching pic:', pid, index, '/', pics.length);
      console.log('fetching small pic:', url);
      const smBlob = await fetchBlob(url);
      console.log('fetching large pic:', largeUrl);
      const lgBlob = await fetchBlob(largeUrl);
      console.log('finish pic', pid);
      imgBlobList.push({
        pid,
        smBlob,
        lgBlob,
      });
    }
  }

  // videos
  const videoBlobList = [];
  if (statusObj.page_info && statusObj.page_info.media_info) {
    const { stream_url, stream_url_hd } = statusObj.page_info.media_info;
    console.log('fetching video:', stream_url);
    const videoBlob = await fetchBlob(stream_url);
    console.log('fetching hd video:', stream_url_hd);
    const videoHDBlob = await fetchBlob(stream_url_hd);
    videoBlobList.push({
      bid: $render_data.status.bid,
      videoBlob,
      videoHDBlob,
    });
  }

  // videos in retweeted status
  if (statusObj.retweeted_status && statusObj.retweeted_status.page_info && statusObj.retweeted_status.page_info.media_info) {
    const { stream_url, stream_url_hd } = statusObj.retweeted_status.page_info.media_info;
    console.log('fetching video:', stream_url);
    const videoBlob = await fetchBlob(stream_url);
    console.log('fetching hd video:', stream_url_hd);
    const videoHDBlob = await fetchBlob(stream_url_hd);
    videoBlobList.push({
      bid: statusObj.retweeted_status.bid,
      videoBlob,
      videoHDBlob,
    });
  }

  // pack zip file
  const zip = new JSZip();
  zip.file("content.json", statusDataBlob);
  zip.file("interaction.json", interactionDataBlob);

  const picsFolder = zip.folder("pics");
  imgBlobList.forEach(item => {
    const { pid, smBlob, lgBlob } = item;
    picsFolder.file(`${pid}.${smBlob.type.split('/')[1]}`, smBlob);
    picsFolder.file(`${pid}.large.${lgBlob.type.split('/')[1]}`, lgBlob);
  });

  const videosFolder = zip.folder("videos");
  videoBlobList.forEach(item => {
    const { bid, videoBlob, videoHDBlob } = item;
    videosFolder.file(`video-${bid}.${videoBlob.type.split('/')[1]}`, videoBlob);
    videosFolder.file(`video-${bid}-hd.${videoHDBlob.type.split('/')[1]}`, videoHDBlob);
  });

  const finalResultBlob = await zip.generateAsync({
    type: "blob",
  });

  const dateStr =
    new Date()
      .toJSON()
      .replace(/[-:"]/g, "")
      .split("T")[0] +
    new Date()
      .toTimeString()
      .split(":")
      .slice(0, 2)
      .join("");

  // download
  const a = document.createElement('a');
  a.download = `weibo-${$render_data.status.bid}-${dateStr}.zip`;
  a.href = URL.createObjectURL(finalResultBlob);
  a.click();

  console.log('start download');

  async function fetchBlob(url) {
    return await fetch(`${corsProxyServer}${url}`, {
      credentials: "omit",
      referrer: `https://m.weibo.cn/detail/${$render_data.status.id}`,
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors"
    }).then(r => r.blob());
  }
}

loadLibrary('https://cdn.jsdelivr.net/npm/jszip@3.2.2/dist/jszip.min.js');

async function getWeiboZip() {
  // pc 版跳转
  if (location.host === 'weibo.com' && /^\/\d{10}\/[a-zA-Z0-9]+$/.test(location.pathname)) {
    location.href = `https://m.weibo.cn/status/${location.pathname.match(/^\/\d{10}\/([a-zA-Z0-9]+)$/)[1]}`;
    return;
  }
  if (!$render_data.status || /^\/detail\/(\d+)/.test(location.pathname) && location.pathname.match(/^\/detail\/(\d+)/)[1] !== $render_data.status.id) {
    location.reload();
    return;
  }
  await getComments();
  await getReposts();
  await exportData();
}
