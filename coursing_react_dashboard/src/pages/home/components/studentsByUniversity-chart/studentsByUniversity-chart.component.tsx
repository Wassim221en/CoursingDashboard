import { IStatistics } from 'apis/statistics/statistics.interfaces';
import Chart from 'react-google-charts';
import { useTranslation } from 'react-i18next';

type Props = {
  statistics: IStatistics | null;
};

function StudentsByUniversityChart({ statistics }: Props) {
  const { t } = useTranslation();

  const StudentsByUniversityData = [
    statistics?.universityStudents.map((university) => [
      `${university.university.name}`,
      university.studentsCount,
    ]),
  ];

  const data = [
    ['Type', 'Count'],
    ...((StudentsByUniversityData[0]?.length
      ? StudentsByUniversityData[0]
      : []) as any),
  ];

  const StudentsByUniversityOptions = {
    title: t('statistics.studentsCountByUniversity'),
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
      options={StudentsByUniversityOptions}
      width="100%"
      height="400px"
    />
  );
}

export default StudentsByUniversityChart;
