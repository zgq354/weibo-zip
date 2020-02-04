
interface WeiboUser {
  id: number;
  screen_name: string;
  profile_image_url: string;
  profile_url: string;
  statuses_count: number;
  verified: true
  verified_type: number;
  verified_type_ext: number;
  verified_reason: string;
  close_blue_v: boolean;
  description: string;
  gender: string;
  followers_count: number;
  follow_count: number;
  cover_image_phone: string;
  avatar_hd: string;
}

interface WeiboPics {
  pid: string;
  url: string;
  size: "orj360" | "large";
  large: {
    url: WeiboPics['url'];
    size: WeiboPics['size'];
  };
}

export interface WeiboStatus {
  created_at: string;
  id: string;
  mid: string;
  text: string;
  pics: WeiboPics[];
  pic_ids: string[];
  user: WeiboUser;
  retweeted_status?: WeiboStatus;
  reposts_count: number;
  comments_count: number;
  attitudes_count: number;
  pic_num: number;
  raw_text?: string;
  bid: string;
  status_title?: string;
  page_info?: {
    media_info?: {
      stream_url: string;
      stream_url_hd: string;
      duration: number;
    }
  }
}
