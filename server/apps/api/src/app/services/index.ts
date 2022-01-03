export * from './iplookup.service';
export * from './open-vidu-api.service';
export * from './workflow-repo.service';

import axios, { AxiosRequestConfig } from 'axios';

const cvApiUrl = process.env.CV_API_URL;

const axiosConfig: AxiosRequestConfig = {
  baseURL: cvApiUrl
};

const axiosBackendClient = axios.create(axiosConfig);

export default axiosBackendClient;

import { CvApi } from './cv-api';

export const cvApi = new CvApi(
  {
    basePath: cvApiUrl,
    isJsonMime: () => false
  },
  cvApiUrl,
  axiosBackendClient
);
