import Link from 'next/link';
import { useEffect, useState } from 'react';

const CookieConsent = () => {
  const [isAccepted, setIsAccepted] = useState(true);

  useEffect(() => {
    setIsAccepted(document.cookie.includes('cookie-consent=true'));
  }, []);

  useEffect(() => {
    if (isAccepted) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [isAccepted]);

  const handleAccept = () => {
    document.cookie = 'cookie-consent=true; max-age=31536000';
    setIsAccepted(true);
  };

  if (!isAccepted) {
    return (
      <div className="absolute left-0 top-0 z-50 h-full w-full bg-black/75">
        <div className="fixed bottom-0 flex h-32 w-full items-center rounded-t-lg bg-neutral-900 px-4 align-middle">
          <div className="flex w-full justify-between">
            <div>
              <p className=" text-white">
                Hi, this site uses cookies like any other website.
              </p>
              <p>
                If you want to learn more about cookies please check out our{' '}
                <span className="font-medium text-white hover:text-red-500">
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </span>
              </p>
            </div>
            <button
              className="w-24 rounded-md text-neutral-400 ring-2 ring-neutral-800 transition-colors duration-100 hover:text-white hover:ring-red-600"
              onClick={handleAccept}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export { CookieConsent };
