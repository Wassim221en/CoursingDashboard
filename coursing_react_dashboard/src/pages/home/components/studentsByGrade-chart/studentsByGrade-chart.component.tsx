import { IStatistics } from 'apis/statistics/statistics.interfaces';
import Chart from 'react-google-charts';
import { useTranslation } from 'react-i18next';

type Props = {
  statistics: IStatistics | null;
};

function StudentsByGradeChart({ statistics }: Props) {
  const { t } = useTranslation();

  const StudentsByGradeData = [
    statistics?.schoolStudents.map((school) => [
      `${school.grade.name}`,
      school.studentsCount,
    ]),
  ];

  const data = [
    ['Type', ''],
    ...((StudentsByGradeData[0]?.length ? StudentsByGradeData[0] : []) as any),
  ];

  const options = {
    title: t('statistics.studentsCountByGrade'),
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
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}

export default StudentsByGradeChart;
