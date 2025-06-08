import React from 'react';
import CGMLineChart from '../Components/CGMLineChart';
import CGMReportPDF from '../Components/PDFGenerator';

const MockScreen = () => {
  const generateMockCGMData = () => {
    const data = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      time.setMinutes(0, 0, 0);

      data.push({
        timestamp: time.toISOString(),
        glucose: Math.floor(80 + Math.random() * 60), // realistic range: 80–140 mg/dL
      });
    }

    return data;
  };

  const generateMockWeeklyCGMData = () => {
    const now = new Date();
    const days = 7;
    const readingsPerDay = 4;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);

      for (let j = 0; j < readingsPerDay; j++) {
        const readingTime = new Date(date);
        readingTime.setHours(6 + j * 6); // 6AM, 12PM, 6PM, 12AM
        data.push({
          timestamp: readingTime.toISOString(),
          glucose: Math.floor(Math.random() * 160) + 60, // range: 60–220
        });
      }
    }

    return data;
  };

  // Example usage:
  const cgmData = generateMockCGMData();
  const weekdata = generateMockWeeklyCGMData();

  return (
    <>
      <CGMLineChart cgmData={cgmData} timeRange={'day'} />
      <CGMReportPDF cgmData={weekdata} />
    </>
  );
};

export default MockScreen;
