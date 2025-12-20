import { useState, useEffect } from "react";

interface UrlInfo {
  pathname: string;
  searchParams: Record<string, string>;
  hash: string;
  port: string;
  host: string;
  hostname: string;
  href: string;
  origin: string;
}

export const useUrlInfo = (): UrlInfo => {
  const getUrlInfo = (): UrlInfo => {
    // Check if the window object is available in the current environment (client-side)
    if (typeof window === "undefined") {
      return {
        pathname: "",
        searchParams: {},
        hash: "",
        port: "",
        host: "",
        hostname: "",
        href: "",
        origin: "",
      };
    }

    const { pathname, hash, port, host, hostname, href, origin, search } = window.location;
    const searchParamsObj: Record<string, string> = {};

    //?Record basically create an object with key value pair;

    new URLSearchParams(search).forEach((value, key) => {
      searchParamsObj[key] = value;
    });

    return {
      pathname,
      searchParams: searchParamsObj,
      hash,
      port,
      host,
      hostname,
      href,
      origin,
    };
  };

  // setting the data into state;
  const [urlInfo, setUrlInfo] = useState<UrlInfo>(getUrlInfo());

  useEffect(() => {
    // Event listener to update the URL info whenever the URL changes(goto next/prev page)
    const handleUrlChange = () => setUrlInfo(getUrlInfo());

    window.addEventListener("popstate", handleUrlChange);
    //The hashchange event is triggered when the fragment identifier (hash #) of a URL changes in the browser.
    window.addEventListener("hashchange", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, []);

  return urlInfo;
};


// ✅ Fully reactive – updates when URL changes;
// ✅ Works in SSR (Next.js, etc.)
// ✅ Easier query params access
// ✅ Listens for popstate and hashchange

