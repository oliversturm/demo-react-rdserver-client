import React, { useRef, useState, useContext, useEffect } from 'react';
import ko from 'knockout';
import 'devexpress-reporting/dist/css/dx-webdocumentviewer.css';
import 'devexpress-reporting';
import { ReportServerContext } from './ReportServerContext';
import DevExpress from '@devexpress/analytics-core';

const getReportUrl = documentId => `report/${documentId}`;

const ReportServerReport = ({ documentId }) => {
  const { tokenInfo, serviceBaseUrl } = useContext(ReportServerContext);
  const viewer = useRef(null);
  const [observableReportUrl] = useState({
    value: ko.observable(getReportUrl(documentId))
  });
  const [controlInitialized, setControlInitialized] = useState(false);

  useEffect(() => {
    if (!controlInitialized) {
      ko.applyBindings(
        {
          reportUrl: observableReportUrl.value,
          remoteSettings: {
            serverUri: serviceBaseUrl,
            authToken: tokenInfo.token.access_token
          }
        },
        viewer.current
      );
      setControlInitialized(true);
    }
  }, [observableReportUrl, tokenInfo, serviceBaseUrl, controlInitialized]);

  useEffect(() => {
    observableReportUrl.value(getReportUrl(documentId));
  }, [documentId, observableReportUrl]);

  useEffect(() => {
    DevExpress.Analytics.Utils.ajaxSetup.ajaxSettings.headers.Authorization = `Bearer ${
      tokenInfo.token.access_token
    }`;
  }, [tokenInfo]);

  useEffect(() => {
    if (controlInitialized) {
      ko.cleanNode(viewer.current);
      setControlInitialized(false);
    }
    // eslint doesn't understand the situation here with the
    // encapsulated JS control
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceBaseUrl]);

  return (
    <div
      ref={viewer}
      className="fullscreen"
      data-bind="dxReportViewer: $data"
    />
  );
};

export default ReportServerReport;
