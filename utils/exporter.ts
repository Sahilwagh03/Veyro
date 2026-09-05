import { toPng, toBlob } from 'html-to-image';
import JSZip from 'jszip';
import saveAs from 'file-saver';

interface OffscreenClone {
  targetElement: HTMLElement;
  targetHeight: number;
  cleanup: () => void;
}

/**
 * Creates an off-screen clone of the ad canvas at 1080px resolution.
 * The live DOM element visible to the user is NEVER modified, completely eliminating
 * any on-screen jumping, scaling, or glitchiness during download.
 */
function createOffscreenCaptureClone(elementId: string): OffscreenClone | null {
  const element = document.getElementById(elementId);
  if (!element) return null;

  // Create an offscreen invisible container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '1080px';
  container.style.overflow = 'hidden';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '-9999';

  // Deep clone the element so live DOM on screen remains 100% untouched
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = `${elementId}-export-clone`;
  clone.style.transform = 'none';
  clone.style.transformOrigin = '0 0';
  clone.style.width = '1080px';
  clone.style.position = 'relative';

  const inner = clone.firstElementChild as HTMLElement;
  if (inner) {
    inner.style.overflow = 'visible';
    inner.style.height = 'auto';
    inner.style.minHeight = '1080px';
  }

  container.appendChild(clone);
  document.body.appendChild(container);

  // Measure full content height in the off-screen clone
  const measuredHeight = inner ? Math.max(1080, inner.scrollHeight) : 1080;
  clone.style.height = `${measuredHeight}px`;
  if (inner) {
    inner.style.height = `${measuredHeight}px`;
  }
  container.style.height = `${measuredHeight}px`;

  const cleanup = () => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  return { targetElement: clone, targetHeight: measuredHeight, cleanup };
}

export async function exportAdAsPng(elementId: string, filename: string): Promise<string> {
  const cloneData = createOffscreenCaptureClone(elementId);
  if (!cloneData) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  try {
    const dataUrl = await toPng(cloneData.targetElement, {
      width: 1080,
      height: cloneData.targetHeight,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
        width: '1080px',
        height: `${cloneData.targetHeight}px`,
      },
      pixelRatio: 1,
      cacheBust: true,
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
    return dataUrl;
  } finally {
    cloneData.cleanup();
  }
}

export async function copyAdToClipboard(elementId: string): Promise<boolean> {
  const cloneData = createOffscreenCaptureClone(elementId);
  if (!cloneData) return false;

  try {
    const blob = await toBlob(cloneData.targetElement, {
      width: 1080,
      height: cloneData.targetHeight,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
        width: '1080px',
        height: `${cloneData.targetHeight}px`,
      },
      pixelRatio: 1,
      cacheBust: true,
    });
    if (!blob) return false;

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
    return true;
  } catch (err) {
    console.error('Failed to copy image to clipboard:', err);
    return false;
  } finally {
    cloneData.cleanup();
  }
}

export async function exportAllAdsAsZip(
  templateIds: number[],
  prefix: string = 'veyro-creative'
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('veyro-creatives');

  for (const id of templateIds) {
    const elementId = `ad-canvas-${id}`;
    const cloneData = createOffscreenCaptureClone(elementId);
    if (cloneData) {
      try {
        const dataUrl = await toPng(cloneData.targetElement, {
          width: 1080,
          height: cloneData.targetHeight,
          style: {
            transform: 'none',
            transformOrigin: 'top left',
            width: '1080px',
            height: `${cloneData.targetHeight}px`,
          },
          pixelRatio: 1,
          cacheBust: true,
        });
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        folder?.file(`${prefix}-template-${id}.png`, base64Data, { base64: true });
      } catch (e) {
        console.error(`Error exporting template ${id}:`, e);
      } finally {
        cloneData.cleanup();
      }
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `veyro-creatives-batch.zip`);
}
