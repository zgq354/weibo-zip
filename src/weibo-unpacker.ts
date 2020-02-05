
import JSZip from 'jszip';
import { WeiboStatus } from './types';

function readBlobText(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}

export class WeiboUnpacker {
  content: WeiboStatus | null = null;
  objectURLs: string[] = [];
  archiveObj: JSZip | null = null;

  async load(file: File) {
    console.log(file);
    if (file.type !== "application/zip") {
      throw new Error("Invalid file type");
    }
    const zip = new JSZip();
    const archive = await zip.loadAsync(file);
    if (!archive.files["content.json"]) {
      throw new Error('"content.json" not found');
    }

    this.archiveObj = archive;

    // basic content
    const contentBlob = await archive.file("content.json").async("blob");
    this.content = JSON.parse(
      (await readBlobText(contentBlob)) as string
    ) as WeiboStatus;

    await this.processWeiboStatus(this.content);
    return this.content;
  }

  private async processWeiboStatus(status: WeiboStatus) {
    const archive = this.archiveObj!;

    // load pics
    status.pics &&
      (await Promise.all(
        status.pics.map(async item => {
          const {
            pid,
          } = item;

          const picFileName = Object.keys(archive.files).filter(key => key.startsWith(`pics/${pid}.`) && key.split('.')[1] !== 'large')[0];
          const picBlob = await archive.file(picFileName).async("blob");
          const picURL = URL.createObjectURL(picBlob);
          item.url = picURL;

          const largePicFileName = Object.keys(archive.files).filter(key => key.startsWith(`pics/${pid}.large.`))[0];
          const largePicBlob = await archive.file(largePicFileName).async("blob");
          const largePicURL = URL.createObjectURL(largePicBlob);
          item.large.url = largePicURL;

          this.objectURLs.push(picURL, largePicURL);
        })
      ));

    // videos
    if (status.page_info?.media_info) {
      const fold = archive.folder("videos");
      const videoFileName = Object.keys(fold.files).filter(key => key.startsWith(`videos/video-${status.bid}.`))[0];
      const videoBlob = await archive.file(videoFileName).async('blob');
      const videoURL = URL.createObjectURL(videoBlob);
      status.page_info.media_info.stream_url = videoURL;

      const videoHDFileName = Object.keys(fold.files).filter(key => key.startsWith(`videos/video-${status.bid}-hd.`))[0];
      const videoHDBlob = await archive.file(videoHDFileName).async('blob');
      const videoHDURL = URL.createObjectURL(videoHDBlob);
      status.page_info.media_info.stream_url_hd = videoHDURL;

      this.objectURLs.push(videoURL, videoHDURL);
    }

    // retweeted
    status.retweeted_status && await this.processWeiboStatus(status.retweeted_status);
  }

  revoke() {
    this.objectURLs.forEach(url => URL.revokeObjectURL(url));
  }
}
