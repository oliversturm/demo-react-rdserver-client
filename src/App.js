import React, { useState } from 'react';
import Globalize from 'globalize';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';
import './App.css';

import DocumentSelector from './DocumentSelector';
import { ReportServerProvider } from './ReportServerContext';
import ReportServerDocumentViewer from './ReportServerDocumentViewer';

const App = () => {
  Globalize.load(
    require('devextreme-cldr-data/en.json'),
    require('devextreme-cldr-data/supplemental.json')
  );
  Globalize.locale('en');

  const [document, setDocument] = useState(-1);

  return (
    <ReportServerProvider
      serviceBaseUrl="https://reportserver.devexpress.com"
      username="Guest"
      password=""
    >
      <DocumentSelector documentSelected={setDocument} />
      <ReportServerDocumentViewer document={document || {}} />
    </ReportServerProvider>
  );
};

export default App;
