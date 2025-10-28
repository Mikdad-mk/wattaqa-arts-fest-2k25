// Simple quota manager to handle Google Sheets API rate limits
class QuotaManager {
  private requestCount = 0;
  private lastResetTime = Date.now();
  private readonly maxRequestsPerMinute = 100; // Conservative limit
  private readonly resetInterval = 60000; // 1 minute

  async checkQuota(): Promise<void> {
    const now = Date.now();
    
    // Reset counter if a minute has passed
    if (now - this.lastResetTime >= this.resetInterval) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    
    // If we're approaching the limit, wait
    if (this.requestCount >= this.maxRequestsPerMinute - 10) {
      const waitTime = this.resetInterval - (now - this.lastResetTime);
      console.log(`Quota limit approaching, waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.lastResetTime = Date.now();
    }
    
    this.requestCount++;
  }

  async handleQuotaError(error: any): Promise<void> {
    if (error.code === 429 || error.message?.includes('Quota exceeded')) {
      console.log('Quota exceeded, waiting 60 seconds...');
      await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
      this.requestCount = 0;
      this.lastResetTime = Date.now();
    }
  }
}

export const quotaManager = new QuotaManager();