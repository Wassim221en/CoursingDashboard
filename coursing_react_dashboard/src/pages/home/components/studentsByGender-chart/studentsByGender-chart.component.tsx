import { IStatistics } from 'apis/statistics/statistics.interfaces';
import Chart from 'react-google-charts';
import { useTranslation } from 'react-i18next';

type Props = {
  statistics: IStatistics | null;
};

function StudentsByGenderChart({ statistics }: Props) {
  const { t } = useTranslation();

  const StudentsByGenderData = [
    ['Type', 'Count'],
    [t('statistics.male'), statistics?.maleStudentCount],
    [t('statistics.female'), statistics?.femaleStudentCount],
  ];

  const StudentsByGenderOptions = {
    title: t('statistics.studentsCountByGender'),
    fontName: 'Tajawal-Regular',
    bold: true,
    color: '#871b47',
    auraColor: '#d799ae',
    opacity: 0.8,
  };

  return (
    <Chart
      chartType="PieChart"
      data={StudentsByGenderData}
      options={StudentsByGenderOptions}
      width="100%"
      height="400px"
    />
  );
}

export default StudentsByGenderChart;
