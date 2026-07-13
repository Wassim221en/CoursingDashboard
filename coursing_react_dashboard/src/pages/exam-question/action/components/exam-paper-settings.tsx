/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Typography,
  Stack,
  TextField,
  Slider,
  ToggleButton,
  Divider,
  Paper,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import GridViewIcon from '@mui/icons-material/GridView';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CheckIcon from '@mui/icons-material/Check';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExamPaperSettingsProps } from './types';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

function ExamPaperSetting({
  setPaperMainTitle,
  setPaperMainTitleFontStyle,
  setPaperBodyStyle,
  setShowPaperInfo,
  setPaperLang,
  showPaperInfo,
  paperLang,
  setChoicesGrid,
}: ExamPaperSettingsProps) {
  const [alignment, setAlignment] = useState('left');
  const [formats, setFormats] = useState(() => ['italic']);
  const [grid, setGrid] = useState(12);
  const { t } = useTranslation();
  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    setFormats(newFormats);
    setPaperBodyStyle((prev) => ({
      ...prev,
      fontStyle: newFormats,
    }));
  };

  const handleGrid = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: number,
  ) => {
    setGrid(newFormats);
    setChoicesGrid(newFormats);
  };

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
    setPaperBodyStyle((prev) => ({
      ...prev,
      textAlign: newAlignment,
    }));
  };
  return (
    <Box>
      <Box m={2}>
        <Stack>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography textAlign="center" fontWeight={600}>
                {t('examPaper.general')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mt={2}>
                <FormControl>
                  <RadioGroup
                    value={paperLang}
                    onChange={(e) => setPaperLang(Number(e.target.value))}
                  >
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="EN"
                    />
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="AR"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography textAlign="center" fontWeight={600}>
                {t('examPaper.pageTitle')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mt={2}>
                <TextField
                  label={t('examPaper.paperMainTitle')}
                  variant="outlined"
                  sx={{ my: 2 }}
                  fullWidth
                  onChange={(e) => setPaperMainTitle(e.target.value)}
                />
                <Typography fontWeight={600}>
                  {t('examPaper.titleFontSize')}
                </Typography>
                <Slider
                  size="small"
                  defaultValue={10}
                  valueLabelDisplay="auto"
                  min={10}
                  max={30}
                  onChange={(_, newValue) =>
                    setPaperMainTitleFontStyle((prev) => ({
                      ...prev,
                      fontSize: newValue,
                    }))
                  }
                />
              </Box>

              <Box mt={2}>
                <Typography fontWeight={600}>
                  {' '}
                  {t('examPaper.titleFontWeight')}
                </Typography>
                <Slider
                  size="small"
                  defaultValue={200}
                  valueLabelDisplay="auto"
                  step={200}
                  min={200}
                  max={600}
                  onChange={(_, newValue) =>
                    setPaperMainTitleFontStyle((prev) => ({
                      ...prev,
                      fontWeight: newValue,
                    }))
                  }
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography textAlign="center" fontWeight={600}>
                {t('examPaper.pageInfo')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mt={2}>
                <Box display="flex">
                  <ToggleButton
                    sx={{ height: 45 }}
                    value="check"
                    selected={showPaperInfo.ShowName}
                    onChange={() => {
                      setShowPaperInfo((prev) => ({
                        ...prev,
                        ShowName: !showPaperInfo.ShowName,
                      }));
                    }}
                  >
                    <CheckIcon />
                  </ToggleButton>
                  <Typography sx={{ my: 2, mx: 2 }}>
                    {' '}
                    {t('examPaper.ShowName')}
                  </Typography>
                </Box>
                <Box display="flex">
                  <ToggleButton
                    sx={{ height: 45 }}
                    value="check"
                    selected={showPaperInfo.ShowSubject}
                    onChange={() => {
                      setShowPaperInfo((prev) => ({
                        ...prev,
                        ShowSubject: !showPaperInfo.ShowSubject,
                      }));
                    }}
                  >
                    <CheckIcon />
                  </ToggleButton>
                  <Typography sx={{ my: 2, mx: 2 }}>
                    {' '}
                    {t('examPaper.showSubject')}
                  </Typography>
                </Box>
                <Box display="flex">
                  <ToggleButton
                    sx={{ height: 45 }}
                    value="check"
                    selected={showPaperInfo.showExamTime}
                    onChange={() => {
                      setShowPaperInfo((prev) => ({
                        ...prev,
                        showExamTime: !showPaperInfo.showExamTime,
                      }));
                    }}
                  >
                    <CheckIcon />
                  </ToggleButton>
                  <Typography sx={{ my: 2, mx: 2 }}>
                    {' '}
                    {t('examPaper.showExamTime')}
                  </Typography>
                </Box>

                <Box display="flex">
                  <ToggleButton
                    sx={{ height: 45 }}
                    value="check"
                    selected={showPaperInfo.showExamDate}
                    onChange={() => {
                      setShowPaperInfo((prev) => ({
                        ...prev,
                        showExamDate: !showPaperInfo.showExamDate,
                      }));
                    }}
                  >
                    <CheckIcon />
                  </ToggleButton>
                  <Typography sx={{ my: 2, mx: 2 }}>
                    {' '}
                    {t('examPaper.showExamDate')}
                  </Typography>
                </Box>

                <Box mt={4}>
                  {' '}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      label="Exam Date"
                      // inputFormat="dd/MM/yyyy"
                      value={undefined}
                      onChange={(newValue) => {
                        setShowPaperInfo((prev) => ({
                          ...prev,
                          Date: String(newValue),
                        }));
                      }}
                      // renderInput={(params) => (
                      //   <TextField
                      //     {...params}
                      //     inputProps={{
                      //       ...params.inputProps,
                      //       placeholder: 'dd/mm/aaaa',
                      //     }}
                      //   />
                      // )}
                    />
                  </LocalizationProvider>
                </Box>

                <Box mt={2}>
                  <Typography fontWeight={600}>
                    {' '}
                    {t('examPaper.fontSize')}
                  </Typography>
                  <Slider
                    size="small"
                    defaultValue={10}
                    valueLabelDisplay="auto"
                    min={10}
                    max={20}
                    onChange={(_, newValue) =>
                      setShowPaperInfo((prev) => ({
                        ...prev,
                        fontSize: Number(newValue),
                      }))
                    }
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography textAlign="center" fontWeight={600}>
                {t('examPaper.pageBody')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mt={3}>
                <Typography fontWeight={600}>
                  {t('examPaper.PaperBodyCustomization')}
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    mt: 2,
                    display: 'flex',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    flexWrap: 'wrap',
                    width: '100%',
                  }}
                >
                  <StyledToggleButtonGroup
                    size="medium"
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                  >
                    <ToggleButton value="left" aria-label="left aligned">
                      <FormatAlignLeftIcon />
                    </ToggleButton>
                    <ToggleButton value="center" aria-label="centered">
                      <FormatAlignCenterIcon />
                    </ToggleButton>
                    <ToggleButton value="right" aria-label="right aligned">
                      <FormatAlignRightIcon />
                    </ToggleButton>
                    <ToggleButton value="justify" aria-label="justified">
                      <FormatAlignJustifyIcon />
                    </ToggleButton>
                  </StyledToggleButtonGroup>
                  <Divider
                    flexItem
                    orientation="vertical"
                    sx={{ mx: 0.5, my: 1 }}
                  />
                  <StyledToggleButtonGroup
                    size="medium"
                    value={formats}
                    onChange={handleFormat}
                    aria-label="text formatting"
                  >
                    <ToggleButton value="italic" aria-label="italic">
                      <FormatItalicIcon />
                    </ToggleButton>
                  </StyledToggleButtonGroup>

                  <Divider
                    flexItem
                    orientation="vertical"
                    sx={{ mx: 0.5, my: 1 }}
                  />
                  <StyledToggleButtonGroup
                    size="medium"
                    value={grid}
                    exclusive
                    onChange={handleGrid}
                    aria-label="text formatting"
                  >
                    <ToggleButton value="12">
                      <FormatListNumberedIcon />
                    </ToggleButton>
                    <ToggleButton value="6">
                      <GridViewIcon />
                    </ToggleButton>
                  </StyledToggleButtonGroup>
                </Paper>
                <Box mt={5}>
                  <Typography fontWeight={600}>
                    {' '}
                    {t('examPaper.fontSize')}
                  </Typography>
                  <Slider
                    size="small"
                    defaultValue={10}
                    valueLabelDisplay="auto"
                    min={10}
                    max={20}
                    onChange={(_, newValue) =>
                      setPaperBodyStyle((prev) => ({
                        ...prev,
                        fontSize: newValue,
                      }))
                    }
                  />

                  <Typography fontWeight={600}>
                    {t('examPaper.fontWeight')}
                  </Typography>
                  <Slider
                    size="small"
                    defaultValue={200}
                    valueLabelDisplay="auto"
                    step={200}
                    min={400}
                    max={600}
                    onChange={(_, newValue) =>
                      setPaperBodyStyle((prev) => ({
                        ...prev,
                        fontWeight: newValue,
                      }))
                    }
                  />
                  <Typography fontWeight={600}>
                    {' '}
                    {t('examPaper.verticalSpaces')}
                  </Typography>
                  <Slider
                    size="small"
                    defaultValue={1}
                    valueLabelDisplay="auto"
                    min={1}
                    max={5}
                    onChange={(_, newValue) =>
                      setPaperBodyStyle((prev) => ({
                        ...prev,
                        paddingY: newValue,
                      }))
                    }
                  />
                  <Typography fontWeight={600}>
                    {t('examPaper.horizonalSpaces')}
                  </Typography>
                  <Slider
                    size="small"
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    min={0}
                    max={3}
                    onChange={(_, newValue) =>
                      setPaperBodyStyle((prev) => ({
                        ...prev,
                        paddingX: newValue,
                      }))
                    }
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography textAlign="center" fontWeight={600}>
                {t('examPaper.pageFooter')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mt={2}>
                <TextField
                  label={t('examPaper.pageNumber')}
                  variant="outlined"
                  type="number"
                  sx={{ my: 2 }}
                  fullWidth
                  onChange={(e) =>
                    setShowPaperInfo((prev) => ({
                      ...prev,
                      PageNumber: Number(e.target.value),
                    }))
                  }
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Box>
    </Box>
  );
}

export default ExamPaperSetting;
