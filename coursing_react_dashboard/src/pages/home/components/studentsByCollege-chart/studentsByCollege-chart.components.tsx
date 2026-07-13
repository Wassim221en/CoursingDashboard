import { IStatistics } from 'apis/statistics/statistics.interfaces';
import Chart from 'react-google-charts';
import { useTranslation } from 'react-i18next';

type Props = {
  statistics: IStatistics | null;
};

function StudentsByCollegeChart({ statistics }: Props) {
  const { t } = useTranslation();

  const StudentsByCollegeData = [
    statistics?.universityStudents.flatMap((college) =>
      college.collegeStudents.map((c) => [
        `${c.college.name}`,
        c.studentsCount,
        'color: gold',
      ]),
    ),
  ];

  const data = [
    ['Type', '', { role: 'style' }],
    ...((StudentsByCollegeData[0]?.length
      ? StudentsByCollegeData[0]
      : []) as any),
  ];

  const options = {
    title: t('statistics.studentsCountByCollege'),
    legend: 'none',
    explorer: {
      axis: 'horizontal',
      actions: ['dragToPan', 'rightClickToReset'],
    },
    fontName: 'Tajawal-Regular',
    bold: true,
    color: '#871b47',
    auraColor: '#d799ae',
    opacity: 0.8,
  };
  return (
    <Chart
      chartType="ColumnChart"
      height="400px"
      data={data}
      options={options}
    />
  );
}

export default StudentsByCollegeChart;
