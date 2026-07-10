import React, {useEffect, useState} from 'react';
import CGMLineChart from '../components/CGMLineChart';
import CGMReportPDF from '../components/PDFGenerator';
import {useUser} from '../contexts/userContext';

const MockScreen = () => {
  const {user} = useUser();
  const [weekdata, setWeekdata] = useState([]);

  useEffect(() => {
    if (!user || !user._id) {
      return;
    }
    fetch(`http://localhost:3000/cgm/last7d/${user._id}`)
      .then(res => res.json())
      .then(data => setWeekdata(data.readings || []))
      .catch(err => console.error('Error fetching weekly CGM data:', err));
  }, [user]);

  return (
    <>
      <CGMLineChart user={user} />
      <CGMReportPDF cgmData={weekdata} />
    </>
  );
};

export default MockScreen;
