'use client';

import { useEffect } from "react";

type AdSensePushItem = Record<string, unknown>;

declare global { interface Window { adsbygoogle?: AdSensePushItem[]; } }

// type AdsByGoogleArray = Array<AdSensePushItem> & {
//   push: (...items: AdSensePushItem[]) => number;
// };

// declare global {
//   interface Window {
//     adsbygoogle?: AdsByGoogleArray;
//   }
// }

export default function AdUnit({ slotId, format = "auto", className = "" }: {
  slotId: string; format?: "auto" | "fluid" | "rectangle"; className?: string
}) {
  useEffect(() => {
    try {
      // (adsbygoogle = window.adsbygoogle || []).push({});
      // (window.adsbygoogle = window.adsbygoogle || []).push({});
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (err) {
      console.error("AdsbyGoogle error:", err);
    } // Ignore errors if adsbygoogle is not defined
  }, [slotId]);

  return (
    <div className={`my-8 flex justify-center overflow-hidden min-h-25 bg-muted/10 rounded-lg p-2 ${className}`}>
      <ins className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-5985748083506964"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-adtest="on"
      />
    </div>
  )
}