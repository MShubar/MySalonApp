import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const useProgressBar = (pathname) => {
  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname]);
};

export default useProgressBar;
