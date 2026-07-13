import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import SchoolIcon from '@mui/icons-material/School';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import GradeIcon from '@mui/icons-material/Grade';
import AddIcon from '@mui/icons-material/Add';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import BarChartIcon from '@mui/icons-material/BarChart';
import React, { ReactNode } from 'react';
import routesNames from 'routes/constants';
import { ControllersNames } from 'constants/constants';
import { QuestionMark } from '@mui/icons-material';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import StorefrontIcon from '@mui/icons-material/Storefront';
import GroupsIcon from '@mui/icons-material/Groups';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import { useTranslation } from 'react-i18next';
import CastIcon from '@mui/icons-material/Cast';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SellIcon from '@mui/icons-material/Sell';
import SendIcon from '@mui/icons-material/Send';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { IWebContents } from 'apis/permissions/permissions.interfaces';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';

export type TRouteLink = {
  text: string;
  icon: ReactNode;
  link?: string;
  linkChildren?: TRouteLink[];
  controllerName?: string;
  allowedControllers?: IWebContents[];
};

function useSideLinks() {
  const { t } = useTranslation();
  const routeLinks: TRouteLink[] = [
    {
      text: t('common.statistics'),
      icon: <EqualizerIcon />,
      link: routesNames.home,
      controllerName: ControllersNames.Home,
    },
    {
      text: t('common.ads'),
      icon: <SellIcon />,
      link: routesNames.ads,
      controllerName: ControllersNames.Ads,
    },
    {
      text: t('common.students'),
      icon: <EmojiPeopleIcon />,
      link: routesNames.students,
      controllerName: ControllersNames.Students,
    },
    {
      text: t('users.users'),
      icon: <GroupIcon />,
      link: routesNames.users,
      controllerName: ControllersNames.Account,
    },
    {
      text: t('rolesAndPermissions.rolesAndPermissions'),
      icon: <VerifiedUserIcon />,
      link: routesNames.userRolesAndPermissions,
      controllerName: ControllersNames.Account,
    },
    // {
    //   text: t('common.rooms'),
    //   icon: <GroupsIcon />,
    //   link: routesNames.rooms,
    //   controllerName: ControllersNames.Room,
    // },
    {
      text: t('requestPaper.requestPaper'),
      icon: <SendIcon />,
      link: routesNames.requestPapers,
      controllerName: ControllersNames.RequestPaperCopy,
    },

    {
      text: t('common.instructors'),
      icon: <AdminPanelSettings />,
      linkChildren: [
        {
          text: t('common.instructors'),
          icon: <AdminPanelSettings />,
          link: routesNames.instructors,
          controllerName: ControllersNames.Instructor,
        },
        {
          text: t('reports.instructorsReports'),
          icon: <ReportGmailerrorredIcon />,
          link: routesNames.instructorsReports,
          controllerName: ControllersNames.Instructor,
        },
      ],
    },

    {
      text: t('common.universities'),
      icon: <SchoolIcon />,

      linkChildren: [
        {
          text: t('common.courses'),
          icon: <GradeIcon />,
          link: routesNames.universityCourses,
          controllerName: ControllersNames.UniversityCourses,
        },

        {
          text: t('common.exams'),
          icon: <BorderColorIcon />,
          linkChildren: [
            {
              text: t('common.exams'),
              icon: <BorderColorIcon />,
              link: routesNames.universityExams,
              controllerName: ControllersNames.UniversityExams,
            },
            {
              text: t('exams.liveExams'),
              icon: <CastIcon />,
              link: routesNames.universityLiveExams,
              controllerName: ControllersNames.UniversityLiveExams,
            },
            {
              text: t('reports.examsReports'),
              icon: <ReportGmailerrorredIcon />,
              link: routesNames.universityExamsReports,
              controllerName: ControllersNames.UniversityExams,
            },
          ],
        },

        {
          text: t('news.news'),
          icon: <NewspaperIcon />,
          link: routesNames.universityNews,
          controllerName: ControllersNames.UniversityNews,
        },
        {
          text: t('reports.generalReports'),
          icon: <ReportGmailerrorredIcon />,
          link: routesNames.universityReports,
          controllerName: ControllersNames.UniversityNews,
        },
        // {
        //   text: t('universities.yearlyProjects'),
        //   icon: <SchoolIcon />,
        //   link: routesNames.graduationProject,
        //   controllerName: ControllersNames.GraduationProjects,
        // },

        {
          text: t('common.questionBank'),
          icon: <CollectionsBookmarkIcon />,
          linkChildren: [
            {
              text: t('common.questionBank'),
              icon: <CollectionsBookmarkIcon />,
              link: routesNames.universityQuestionsBank,
              controllerName: ControllersNames.UniversityQuestionBank,
            },

            {
              text: t('reports.questionsReports'),
              icon: <ReportGmailerrorredIcon />,
              link: routesNames.universityQuestionsBankReports,
              controllerName: ControllersNames.UniversityQuestionBank,
            },
          ],
        },

        {
          text: t('common.settings'),
          icon: <SettingsSuggestIcon />,

          linkChildren: [
            {
              text: t('universities.universities'),
              icon: <HistoryEduIcon />,
              link: routesNames.universities,
              controllerName: ControllersNames.University,
            },
            {
              text: t('universities.colleges'),
              icon: <SquareFootIcon />,
              link: routesNames.colleges,
              controllerName: ControllersNames.College,
            },

            {
              text: t('universities.semesters'),
              icon: <AutoStoriesIcon />,
              link: routesNames.semesters,
              controllerName: ControllersNames.Semester,
            },
            {
              text: t('universities.subjects'),
              icon: <LocalLibraryIcon />,
              link: routesNames.collegeSubjects,
              controllerName: ControllersNames.University,
            },
          ],
        },
      ],
    },

    {
      text: t('common.schooling'),
      icon: <SchoolIcon />,
      linkChildren: [
        {
          text: t('common.courses'),
          icon: <GradeIcon />,
          link: routesNames.schoolCourses,
          controllerName: ControllersNames.SchoolingCourses,
        },

        {
          text: t('common.exams'),
          icon: <BorderColorIcon />,
          linkChildren: [
            {
              text: t('common.exams'),
              icon: <BorderColorIcon />,
              link: routesNames.schoolExams,
              controllerName: ControllersNames.SchoolingExams,
            },
            {
              text: t('exams.liveExams'),
              icon: <CastIcon />,
              link: routesNames.schoolLiveExams,
              controllerName: ControllersNames.SchoolingLiveExams,
            },
            {
              text: t('reports.examsReports'),
              icon: <ReportGmailerrorredIcon />,
              link: routesNames.schoolExamsReports,
              controllerName: ControllersNames.SchoolingExams,
            },
          ],
        },

        {
          text: t('news.news'),
          icon: <NewspaperIcon />,
          link: routesNames.schoolNews,
          controllerName: ControllersNames.SchoolingNews,
        },
        {
          text: t('reports.generalReports'),
          icon: <ReportGmailerrorredIcon />,
          link: routesNames.schoolReports,
          controllerName: ControllersNames.UniversityNews,
        },

        {
          text: t('common.questionBank'),
          icon: <CollectionsBookmarkIcon />,
          linkChildren: [
            {
              text: t('common.questionBank'),
              icon: <CollectionsBookmarkIcon />,
              link: routesNames.schoolQuestionsBank,
              controllerName: ControllersNames.SchoolingQuestionBank,
            },

            {
              text: t('reports.questionsReports'),
              icon: <ReportGmailerrorredIcon />,
              link: routesNames.schoolQuestionsBankReports,
              controllerName: ControllersNames.SchoolingQuestionBank,
            },
          ],
        },

        {
          text: t('common.settings'),
          icon: <SettingsSuggestIcon />,
          linkChildren: [
            {
              text: t('schooling.educationLevel'),
              icon: <BarChartIcon />,
              link: routesNames.educationalLevel,
              controllerName: ControllersNames.EducationalLevel,
            },
            {
              text: t('schooling.grades'),
              icon: <BarChartIcon />,
              link: routesNames.grades,
              controllerName: ControllersNames.Grade,
            },
            {
              text: t('schooling.subjects'),
              icon: <LocalLibraryIcon />,
              link: routesNames.schoolSubjects,
              controllerName: ControllersNames.SchoolingSubject,
            },
          ],
        },
      ],
    },

    {
      text: t('common.specialized'),
      icon: <GradeIcon />,
      linkChildren: [
        {
          text: t('common.courses'),
          icon: <GradeIcon />,
          link: routesNames.specializedCourses,
          controllerName: ControllersNames.SpecialtyCourses,
        },

        {
          text: t('common.exams'),
          icon: <BorderColorIcon />,
          linkChildren: [
            {
              text: t('common.exams'),
              icon: <BorderColorIcon />,
              link: routesNames.specializedExams,
              controllerName: ControllersNames.SpecialtyExams,
            },

            {
              text: t('reports.examsReports'),
              icon: <ReportGmailerrorredIcon />,
              link: routesNames.specializedExamsReports,
              controllerName: ControllersNames.SpecialtyExams,
            },
          ],
        },

        {
          text: t('common.specialized'),
          icon: <AddIcon />,
          link: routesNames.specialized,
          controllerName: ControllersNames.Specialized,
        },
        {
          text: t('news.news'),
          icon: <NewspaperIcon />,
          link: routesNames.specializeNews,
          controllerName: ControllersNames.SpecialtyNews,
        },
        {
          text: t('reports.generalReports'),
          icon: <ReportGmailerrorredIcon />,
          link: routesNames.specializedReports,
          controllerName: ControllersNames.SpecialtyExams,
        },

        {
          text: t('common.questionBank'),
          icon: <CollectionsBookmarkIcon />,
          linkChildren: [
            {
              text: t('common.questionBank'),
              icon: <CollectionsBookmarkIcon />,
              link: routesNames.specializeQuestionsBank,
              controllerName: ControllersNames.SpecialtyQuestionBank,
            },

            {
              text: t('reports.questionsReports'),
              icon: <ReportGmailerrorredIcon />,
              link: routesNames.specializeQuestionsBankReports,
              controllerName: ControllersNames.SpecialtyQuestionBank,
            },
          ],
        },
      ],
    },
    {
      text: t('common.settings'),
      icon: <SettingsSuggestIcon />,

      linkChildren: [
        {
          text: t('common.countries'),
          icon: <HolidayVillageIcon />,
          link: routesNames.countries,
          controllerName: ControllersNames.Country,
        },
        {
          text: t('common.cities'),
          icon: <MapsHomeWorkIcon />,
          link: routesNames.cities,
          controllerName: ControllersNames.City,
        },
        {
          text: t('common.salesPoints'),
          icon: <StorefrontIcon />,
          link: routesNames.salesPoint,
          controllerName: ControllersNames.SalesPoint,
        },
        {
          text: t('privacyAndTerms.privacyAndTerms'),
          icon: <AssignmentIcon />,
          link: routesNames.privacyAndTerms,
          controllerName: ControllersNames.Privacy,
        },
        {
          text: t('contactInfo.contactInfo'),
          icon: <ContactPhoneIcon />,
          link: routesNames.contactInfo,
          controllerName: ControllersNames.ContactInfo,
        },
        {
          text: t('coursingInfo.coursingInfo'),
          icon: <YouTubeIcon />,
          link: routesNames.coursingInfo,
          controllerName: ControllersNames.CoursingInfo,
        },
        {
          text: t('appRating.appRating'),
          icon: <ThumbsUpDownIcon />,
          link: routesNames.appRating,
          controllerName: ControllersNames.AppRating,
        },
        {
          text: t('common.faqs'),
          icon: <QuestionMark />,
          link: routesNames.faqs,
          controllerName: ControllersNames.FAQ,
        },
      ],
    },
  ];

  return routeLinks;
}

export default useSideLinks;
