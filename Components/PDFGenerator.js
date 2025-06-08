import React from 'react';
import {Button, Alert, Platform} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';

const analyzeCGM = data => {
  const values = data.map(d => d.glucose);
  const total = values.length;
  const avg = (values.reduce((a, b) => a + b, 0) / total).toFixed(1);
  const high = Math.max(...values);
  const low = Math.min(...values);
  const inRange = values.filter(v => v >= 70 && v <= 180).length;
  const above = values.filter(v => v > 180).length;
  const below = values.filter(v => v < 70).length;
  const percent = val => ((val / total) * 100).toFixed(1) + '%';

  return {
    avg,
    high,
    low,
    timeInRange: percent(inRange),
    timeAboveRange: percent(above),
    timeBelowRange: percent(below),
  };
};

const CGMReportPDF = ({cgmData}) => {
  const generatePDF = async () => {
    if (!cgmData || cgmData.length === 0) {
      Alert.alert('Error', 'No CGM data available for PDF export.');
      return;
    }

    const {avg, high, low, timeInRange, timeAboveRange, timeBelowRange} =
      analyzeCGM(cgmData);

    const formattedRows = cgmData
      .map(entry => {
        const time = new Date(entry.timestamp).toLocaleString();
        return `<tr><td>${time}</td><td>${entry.glucose}</td></tr>`;
      })
      .join('');

    const htmlContent = `
      <h1>Weekly CGM Report</h1>
      <p><strong>Date Range:</strong> ${new Date(
        cgmData[0].timestamp,
      ).toLocaleDateString()} - ${new Date(
      cgmData[cgmData.length - 1].timestamp,
    ).toLocaleDateString()}</p>
      <h2>Summary</h2>
      <ul>
        <li><strong>Average Glucose:</strong> ${avg} mg/dL</li>
        <li><strong>Highest Reading:</strong> ${high} mg/dL</li>
        <li><strong>Lowest Reading:</strong> ${low} mg/dL</li>
      </ul>
      <h2>Glucose Zones</h2>
      <ul>
        <li><strong>Time In Target Range (70–180 mg/dL):</strong> ${timeInRange}</li>
        <li><strong>Time Above 180 mg/dL:</strong> ${timeAboveRange}</li>
        <li><strong>Time Below 70 mg/dL:</strong> ${timeBelowRange}</li>
      </ul>
      <h2>Detailed Readings</h2>
      <table border="1" cellspacing="0" cellpadding="4" style="width: 100%; margin-top: 10px;">
        <tr><th>Timestamp</th><th>Glucose (mg/dL)</th></tr>
        ${formattedRows}
      </table>
    `;

    try {
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `CGM_Report_${Date.now()}`,
        directory: 'Documents',
        base64: false,
      });

      const filePath = pdf.filePath;

      // Try to open the file
      await FileViewer.open(filePath);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate or open PDF report.');
      console.error(error);
    }
  };

  return (
    <Button title="Download & Open CGM Report PDF" onPress={generatePDF} />
  );
};

export default CGMReportPDF;
