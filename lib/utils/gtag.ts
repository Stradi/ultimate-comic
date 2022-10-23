const sendPageView = (url: URL) => {
  window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
    page_path: url,
  });
};

const sendCustomEvent = (action: string, category: string, label: string) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
  });
};

const sendComicReadEvent = (comicSlug: string, issueSlug: string) => {
  sendCustomEvent('read', 'comic', `${comicSlug}/${issueSlug}`);
};

const sendSearchEvent = (term: string) => {
  sendCustomEvent('search', 'comic', term);
};

export { sendPageView, sendComicReadEvent, sendSearchEvent };
