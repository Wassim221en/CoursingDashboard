import { lazy } from 'react';
import routesNames from 'routes/constants';
import TRoute from 'routes/types';

const FaqPage = lazy(() => import('pages/faq/faq.page'));
const RoomDetailsPage = lazy(
  () => import('pages/room-details/room-details.page'),
);
const AdsPage = lazy(() => import('pages/ads/ads.page'));
const RoomsPage = lazy(() => import('pages/rooms/rooms.page'));
const StudentDetails = lazy(
  () => import('pages/student-details/student-details.page'),
);
const VideoSections = lazy(
  () => import('pages/video-sections/video-sections.page'),
);

const RequestPaper = lazy(
  () => import('pages/request-paper/request-paper.page'),
);

const PrivacyAndTerms = lazy(
  () => import('pages/privacyAndTerms/privacy-and-terms.page'),
);

const ContactInfo = lazy(() => import('pages/contact-info/contact-info.page'));

const AppRating = lazy(() => import('pages/app-rating/app-rating.page'));

const settingsRoutes: TRoute[] = [
  {
    path: routesNames.faqs,
    element: <FaqPage />,
  },

  {
    path: routesNames.contactInfo,
    element: <ContactInfo />,
  },
  {
    path: routesNames.appRating,
    element: <AppRating />,
  },

  {
    path: routesNames.privacyAndTerms,
    element: <PrivacyAndTerms />,
  },

  // {
  //   path: routesNames.rooms,
  //   element: <RoomsPage />,
  // },
  // {
  //   path: routesNames.roomDetails,
  //   element: <RoomDetailsPage />,
  // },
  {
    path: routesNames.studentDetails,
    element: <StudentDetails />,
  },
  {
    path: routesNames.videoSections,
    element: <VideoSections />,
  },
  {
    path: routesNames.ads,
    element: <AdsPage />,
  },
  {
    path: routesNames.requestPapers,
    element: <RequestPaper />,
  },
];

export default settingsRoutes;
