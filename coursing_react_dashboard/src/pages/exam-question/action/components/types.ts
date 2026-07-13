import { SxProps } from '@mui/system';
import { TQuestionState } from '../action';

type IPaperInfo = {
  ShowName: boolean;
  ShowMark: boolean;
  ShowSubject: boolean;
  showExamTime: boolean;
  showExamDate: boolean;
  fontSize: number;
  Date: string;
  PageNumber: number;
};

export type ExamPaperProps = {
  questions: TQuestionState[];
  onMarkChange: (question: TQuestionState) => void;
  onRemove: (questionId: number) => void;
  onDelete: (questionId: number) => void;
  paperMainTitle: string;
  paperMainTitleFontStyle: SxProps;
  paperBodyStyle: SxProps;
  paperLang: number;
  choicesGrid: number;
  showPaperInfo: IPaperInfo;
  examTime?: string;
  isLoadingExamDetails: boolean;
};

export type ExamPaperSettingsProps = {
  setPaperMainTitle: React.Dispatch<React.SetStateAction<string>>;
  setPaperMainTitleFontStyle: React.Dispatch<React.SetStateAction<SxProps<{}>>>;
  setPaperBodyStyle: React.Dispatch<React.SetStateAction<SxProps<{}>>>;
  setChoicesGrid: React.Dispatch<React.SetStateAction<number>>;
  setShowPaperInfo: React.Dispatch<
    React.SetStateAction<{
      ShowName: boolean;
      ShowMark: boolean;
      ShowSubject: boolean;
      showExamTime: boolean;
      showExamDate: boolean;
      fontSize: number;
      Date: string;
      PageNumber: number;
    }>
  >;
  setPaperLang: React.Dispatch<React.SetStateAction<number>>;
  showPaperInfo: {
    ShowName: boolean;
    ShowMark: boolean;
    ShowSubject: boolean;
    showExamTime: boolean;
    showExamDate: boolean;
    fontSize: number;
    Date: string;
    PageNumber: number;
  };
  paperLang: number;
  choicesGrid: number;
};
