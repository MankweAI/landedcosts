type EventName =
  | "page_view"
  | "calc_started"
  | "calc_completed"
  | "hs_suggested"
  | "paywall_viewed"
  | "checkout_clicked"
  | "subscription_started";

type EventPayload = {
  pageTemplate?: string;
  origin?: string;
  productCluster?: string;
  [key: string]: unknown;
};

export function trackEvent(name: EventName, payload: EventPayload = {}) {
  const stamped = {
    event: name,
    ts: new Date().toISOString(),
    ...payload
  };
  if (typeof window === "undefined") {
    console.info("[event]", stamped);
    return;
  }
  window.dispatchEvent(new CustomEvent("landedcosts:event", { detail: stamped }));
}

