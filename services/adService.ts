import { apiClient } from './apiClient';
import { AdContent } from '@/types/ad';

export interface GenerateAdResponse {
  content: AdContent;
  isAiGenerated: boolean;
}

export const adService = {
  async generateAd(prompt: string): Promise<GenerateAdResponse> {
    const { data } = await apiClient.post<GenerateAdResponse>('/api/generate-ad', { prompt });
    return data;
  },
};
