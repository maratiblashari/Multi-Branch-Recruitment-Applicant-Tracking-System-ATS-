import { useState, useEffect } from 'react';
import { getJobsAPI } from '../api/axios';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';

const BRANCHES = ['All', 'Islamabad', 'Lahore', 'Karachi', 'Remote'];
const DEPARTMENTS = ['All', 'Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales', 'IT', 'Design', 'Legal'];

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('All');
  const [department, setDepartment] = useState('All');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (branch !== 'All') params.branch = branch;
      if (department !== 'All') params.department = department;
      const { data } = await getJobsAPI(params);
      setJobs(data);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [branch, department]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Now Hiring Across Pakistan</div>
          <h1 className="hero-title">Find Your Dream Career at <span className="gradient-text">Maratib</span></h1>
          <p className="hero-subtitle">Explore exciting opportunities across our Islamabad, Lahore, Karachi, and Remote branches.</p>

          {/* Search Bar */}
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              id="job-search-input"
              type="text"
              placeholder="🔍 Search jobs by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-primary search-btn">Search</button>
          </form>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="stat-card"><span className="stat-num">{jobs.length}+</span><span className="stat-label">Open Positions</span></div>
          <div className="stat-card"><span className="stat-num">4</span><span className="stat-label">Branches</span></div>
          <div className="stat-card"><span className="stat-num">10+</span><span className="stat-label">Departments</span></div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="container">
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">📍 Branch</label>
              <div className="filter-pills">
                {BRANCHES.map(b => (
                  <button
                    key={b}
                    id={`branch-filter-${b.toLowerCase()}`}
                    onClick={() => setBranch(b)}
                    className={`filter-pill ${branch === b ? 'active' : ''}`}
                  >{b}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">🏛 Department</label>
              <select
                id="department-select"
                className="filter-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="jobs-section">
        <div className="container">
          <div className="section-header">
            <h2>Open Positions <span className="count-badge">{jobs.length}</span></h2>
          </div>
          {loading ? (
            <Spinner message="Loading jobs..." />
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>No jobs found matching your criteria.</p>
              <button className="btn-secondary" onClick={() => { setSearch(''); setBranch('All'); setDepartment('All'); }}>Clear Filters</button>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map(job => <JobCard key={job._id} job={job} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
