import { useRouter } from "next/router";
import { useEffect } from "react";

export const useShouldExitPage = (shouldPreventLeaving: boolean) => {
  const router = useRouter();
  const warningText =
    "Are you sure you wish to leave the game - You're score will not be saved!";

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!shouldPreventLeaving) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };

    const handleBrowseAway = () => {
      if (!shouldPreventLeaving) return;
      if (window.confirm(warningText)) return;
      router.events.emit("routeChangeError");
      throw "routeChange aborted.";
    };

    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [router, shouldPreventLeaving]);
};
