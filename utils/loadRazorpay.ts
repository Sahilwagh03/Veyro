/**
 * Robustly loads the Razorpay Checkout SDK script in the browser.
 * Handles background preloading, timeouts, and ad-blocker detection.
 */
export function loadRazorpayScript(timeoutMs = 15000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve(false);
    }

    // 1. If already available on window, resolve immediately
    if ((window as any).Razorpay) {
      return resolve(true);
    }

    const scriptSrc = 'https://checkout.razorpay.com/v1/checkout.js';

    // 2. Helper to check window.Razorpay with polling
    const waitForRazorpay = (maxWaitMs: number): Promise<boolean> => {
      const startTime = Date.now();
      return new Promise((res) => {
        const interval = setInterval(() => {
          if ((window as any).Razorpay) {
            clearInterval(interval);
            res(true);
          } else if (Date.now() - startTime >= maxWaitMs) {
            clearInterval(interval);
            res(false);
          }
        }, 150);
      });
    };

    // 3. Check if script tag is already in DOM (e.g., from layout preloading)
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) {
      waitForRazorpay(timeoutMs).then((ready) => {
        if (ready) {
          resolve(true);
        } else {
          // Existing script timed out or failed; remove it and re-attempt fresh load
          try {
            existingScript.remove();
          } catch {}
          createAndAttachScript();
        }
      });
      return;
    }

    createAndAttachScript();

    function createAndAttachScript() {
      let isSettled = false;
      const timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          console.warn('Razorpay script load timed out. Check network connection or ad-blockers.');
          resolve(false);
        }
      }, timeoutMs);

      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.crossOrigin = 'anonymous';

      script.onload = async () => {
        if (isSettled) return;
        clearTimeout(timer);
        // Ensure window.Razorpay object has mounted
        const ready = await waitForRazorpay(2000);
        isSettled = true;
        resolve(ready || Boolean((window as any).Razorpay));
      };

      script.onerror = () => {
        if (isSettled) return;
        clearTimeout(timer);
        isSettled = true;
        console.error('Failed to load Razorpay script (net::ERR_TIMED_OUT or blocked by ad-blocker).');
        try {
          script.remove();
        } catch {}
        resolve(false);
      };

      document.body.appendChild(script);
    }
  });
}
