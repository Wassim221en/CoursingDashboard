import { IStatistics } from 'apis/statistics/statistics.interfaces';
import Chart from 'react-google-charts';
import { useTranslation } from 'react-i18next';

type Props = {
  statistics: IStatistics | null;
};

function StudentsByCityChart({ statistics }: Props) {
  const { t } = useTranslation();

  const StudentsByCityData = [
    statistics?.cityStudentStatistics.map((student) => [
      `${student.city.name}`,
      student.studentCount,
    ]),
  ];

  const data = [
    ['Type', 'Count'],
    ...((StudentsByCityData[0]?.length ? StudentsByCityData[0] : []) as any),
  ];

  const StudentsByCityOptions = {
    title: t('statistics.studentsCountByCity'),
    fontName: 'Tajawal-Regular',
    bold: true,
    color: '#871b47',
    auraColor: '#d799ae',
    opacity: 0.8,
  };

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={StudentsByCityOptions}
      width="100%"
      height="400px"
    />
  );
}

export default StudentsByCityChart;
