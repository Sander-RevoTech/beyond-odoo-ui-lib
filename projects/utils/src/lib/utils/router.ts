import { Router } from '@angular/router';

export const getFirstSegmentRouteName = (router: Router): string => {
  return router.url.split('/')[1];
};
