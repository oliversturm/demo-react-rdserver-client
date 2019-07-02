import React, { useState, useEffect, useCallback, useRef } from 'react';

const getToken = (serviceBaseUrl, username, password) =>
  fetch(serviceBaseUrl + '/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(
      Object.entries({ username, password, grant_type: 'password' })
    )
  }).then(res => res.json());

const getAuthHeaders = token => ({
  Authorization: `${token.token_type} ${token.access_token}`
});

const ReportServerContext = React.createContext({});

const ReportServerProvider = ({
  username,
  password,
  serviceBaseUrl,
  children
}) => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [updateTokenTimeout, setUpdateTokenTimeout] = useState(null);
  const refUpdateTokenTimeout = useRef(updateTokenTimeout);

  const updateTokenInfo = useCallback(() => {
    getToken(serviceBaseUrl, username, password).then(token => {
      setTokenInfo({ token, authHeaders: getAuthHeaders(token) });
      setUpdateTokenTimeout(
        setTimeout(updateTokenInfo, (token.expires_in - 60) * 1000)
      );
    });
  }, [serviceBaseUrl, username, password]);

  useEffect(() => {
    refUpdateTokenTimeout.current = updateTokenTimeout;
  }, [updateTokenTimeout]);

  useEffect(() => {
    updateTokenInfo();
    return () => clearTimeout(refUpdateTokenTimeout.current);
  }, [serviceBaseUrl, username, password, updateTokenInfo]);

  return (
    <ReportServerContext.Provider value={{ tokenInfo, serviceBaseUrl }}>
      {children}
    </ReportServerContext.Provider>
  );
};

export { ReportServerContext, ReportServerProvider };
