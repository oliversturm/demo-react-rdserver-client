import React, { useRef, useEffect, useState, useContext } from 'react';
import { DashboardControl, ResourceManager } from 'devexpress-dashboard';
import { ReportServerContext } from './ReportServerContext';

const cleanDomNode = node => {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
};

const ReportServerDashboard = ({ documentId }) => {
  ResourceManager.embedBundledResources();

  const { tokenInfo, serviceBaseUrl } = useContext(ReportServerContext);
  const refTokenInfo = useRef(tokenInfo);
  const dashboardContainer = useRef(null);
  const [dashboardControl, setDashboardControl] = useState(null);

  useEffect(() => {
    // instantiate a DashboardControl if we have an access token
    // and it hasn't been created yet
    if (!tokenInfo || dashboardControl) return;

    const targetNode = dashboardContainer.current;

    const newControl = new DashboardControl(targetNode, {
      endpoint: serviceBaseUrl + '/dashboardDesigner',
      workingMode: 'ViewerOnly',
      loadDefaultDashboard: false,
      ajaxRemoteService: {
        beforeSend: xhr => {
          xhr.setRequestHeader(
            'Authorization',
            refTokenInfo.current.authHeaders.Authorization
          );
        }
      }
    });
    setDashboardControl(newControl);
    newControl.render();

    return () => {
      if (dashboardControl) {
        dashboardControl.dispose();
        cleanDomNode(targetNode);
        setDashboardControl(null);
      }
    };
  }, [tokenInfo, dashboardControl, serviceBaseUrl]);

  useEffect(() => {
    // load a dashboard or unload it
    if (dashboardControl) {
      if (documentId >= 0) dashboardControl.loadDashboard(documentId);
      else dashboardControl.unloadDashboard();
    }
  }, [dashboardControl, documentId]);

  useEffect(() => {
    refTokenInfo.current = tokenInfo;
  }, [tokenInfo]);

  useEffect(() => {
    // clean up the dashboard when major changes
    // happen
    if (dashboardControl) {
      dashboardControl.dispose();
      cleanDomNode(dashboardContainer.current);
      setDashboardControl(null);
    }
    // eslint doesn't understand the situation here with the
    // encapsulated JS control
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceBaseUrl, dashboardContainer]);

  return (
    <div
      id="dashboardContainer"
      ref={dashboardContainer}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ReportServerDashboard;
