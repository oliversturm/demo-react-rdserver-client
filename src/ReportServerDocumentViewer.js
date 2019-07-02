import React from 'react';
import ReportServerDashboard from './ReportServerDashboard';
import ReportServerReport from './ReportServerReport';

const viewers = {
  Dashboard: ReportServerDashboard,
  Report: ReportServerReport
};

const Placeholder = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    No document loaded
  </div>
);

const ReportServerDocumentViewer = ({
  document: { id, documentType } = {}
}) => {
  const Viewer = viewers[documentType] || Placeholder;
  return (
    <div
      style={{
        position: 'absolute',
        top: '40px',
        left: '0px',
        right: '0px',
        bottom: '0px'
      }}
    >
      <Viewer documentId={id} />
    </div>
  );
};

export default ReportServerDocumentViewer;
