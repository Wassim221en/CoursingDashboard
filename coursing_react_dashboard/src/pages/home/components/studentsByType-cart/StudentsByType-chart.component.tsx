import { IStatistics } from 'apis/statistics/statistics.interfaces';
import Chart from 'react-google-charts';
import { useTranslation } from 'react-i18next';

type Props = {
  statistics: IStatistics | null;
};

function StudentsByTypeChart({ statistics }: Props) {
  const { t } = useTranslation();

  const StudentsByTypeData = [
    ['Type', 'Count'],
    [t('statistics.universityStudent'), statistics?.collegeStudentsCount],
    [t('statistics.schoolingStudent'), statistics?.schoolStudentsCount],
    [t('statistics.specialityStudent'), statistics?.specialityStudentsCount],
  ];

  const StudentsByTypeOptions = {
    title: t('statistics.studentsCountByType'),
    fontName: 'Tajawal-Regular',
    bold: true,
    color: '#871b47',
    auraColor: '#d799ae',
    opacity: 0.8,
  };

  return (
    <Chart
      chartType="PieChart"
      data={StudentsByTypeData}
      options={StudentsByTypeOptions}
      width="100%"
      height="400px"
    />
  );
}

export default StudentsByTypeChart;
