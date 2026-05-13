import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('atsUser') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ── Auth ──
export const registerAPI    = (data)       => API.post('/auth/register', data);
export const loginAPI       = (data)       => API.post('/auth/login', data);
export const getProfileAPI  = ()           => API.get('/auth/profile');
export const updateProfileAPI = (data)     => API.put('/auth/profile', data);
export const uploadPicAPI   = (formData)   => API.put('/auth/profile/pic', formData);
export const uploadResumeAPI = (formData)  => API.put('/auth/profile/resume', formData);
export const uploadCLAPI    = (formData)   => API.put('/auth/profile/coverletter', formData);
export const getAllUsersAPI  = ()           => API.get('/auth/users');

// ── Jobs ──
export const getJobsAPI       = (params)   => API.get('/jobs', { params });
export const getAllJobsAdminAPI = ()        => API.get('/jobs/admin/all');
export const getJobByIdAPI    = (id)        => API.get(`/jobs/${id}`);
export const createJobAPI     = (data)      => API.post('/jobs', data);
export const updateJobAPI     = (id, data)  => API.put(`/jobs/${id}`, data);
export const deleteJobAPI     = (id)        => API.delete(`/jobs/${id}`);

// ── Applications ──
export const submitApplicationAPI     = (data)       => API.post('/applications', data);
export const getMyApplicationsAPI     = ()           => API.get('/applications/my');
export const getAllApplicationsAPI    = ()           => API.get('/applications');
export const getApplicationsByJobAPI  = (jobId)      => API.get(`/applications/job/${jobId}`);
export const getApplicationByIdAPI   = (id)          => API.get(`/applications/${id}`);
export const updateAppStatusAPI       = (id, data)   => API.put(`/applications/${id}/status`, data);
export const sendCandidateEmailAPI    = (id, data)   => API.post(`/applications/${id}/email`, data);

// ── Interviews ──
export const scheduleInterviewAPI  = (data)      => API.post('/interviews', data);
export const getAllInterviewsAPI   = ()          => API.get('/interviews');
export const getMyInterviewsAPI   = ()          => API.get('/interviews/my');
export const getInterviewByIdAPI  = (id)         => API.get(`/interviews/${id}`);
export const updateInterviewAPI   = (id, data)   => API.put(`/interviews/${id}`, data);
export const deleteInterviewAPI   = (id)         => API.delete(`/interviews/${id}`);

// ── Branches ──
export const getBranchesAPI   = ()          => API.get('/branches');
export const createBranchAPI  = (data)      => API.post('/branches', data);
export const updateBranchAPI  = (id, data)  => API.put(`/branches/${id}`, data);
export const deleteBranchAPI  = (id)        => API.delete(`/branches/${id}`);

export default API;
