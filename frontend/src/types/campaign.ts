export interface RawCampaign {
  id: string;
  type: '購入' | 'モニター' | 'レビュー';
  image: string;  // This is the image key for imageMap
  platforms: string[];
  brand: string;
  description: string | string[];
  campaignBadges?: string[];
  title: string;
  productName: string | string[];
  recruitmentPeriod: string;
  announcementDate: string;
  participantCount: string;
}

export interface BaseCampaign extends Omit<RawCampaign, 'image'> {
  image: string;  // This is the actual image path
}

export interface MonitorCampaign extends BaseCampaign {
  type: 'モニター';
  participationMethod: string[];
  participationDetails: string;
  postPeriod: string;
  compensation: string;
}

export interface PurchaseCampaign extends BaseCampaign {
  type: '購入';
  participationDetails: string;
  purchaseTime: string;
  compensation: string;
}

export interface ReviewCampaign extends BaseCampaign {
  type: 'レビュー';
  participationDetails: string;
  purchaseTime: string;
  postPeriod: string;
  reviewReqs: string[];
  compensation: string;
}

export type Campaign = MonitorCampaign | PurchaseCampaign | ReviewCampaign;

// Type guard to check if a campaign is a monitor campaign
export const isMonitorCampaign = (campaign: Campaign): campaign is MonitorCampaign => {
  return campaign.type === 'モニター';
};

// Type guard to check if a campaign is a purchase campaign
export const isPurchaseCampaign = (campaign: Campaign): campaign is PurchaseCampaign => {
  return campaign.type === '購入';
};

// Type guard to check if a campaign is a review campaign
export const isReviewCampaign = (campaign: Campaign): campaign is ReviewCampaign => {
  return campaign.type === 'レビュー';
};
