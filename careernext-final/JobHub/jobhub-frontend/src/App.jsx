import { useEffect, useMemo, useState } from 'react'
import { Search, MapPin, BriefcaseBusiness, Clock3, ArrowUpRight, Bookmark, Menu, X, Sparkles, Users, Building2, ChevronDown, CheckCircle2 } from 'lucide-react'
import './App.css'
import Portfolio from './Portfolio.jsx'

const demoJobs = [
  { id: 1, title: 'Java Developer Intern', company: 'TechNova Solutions', location: 'Hyderabad, Telangana', type: 'Internship', mode: 'Hybrid', salary: '₹12,000–₹18,000/mo', category: 'Engineering', logo: 'TN', color: 'violet', posted: '2 days ago', description: 'Work with Java, Spring Boot and REST APIs alongside an experienced engineering team.' },
  { id: 2, title: 'Frontend Developer', company: 'PixelCraft Studio', location: 'Remote, India', type: 'Full-time', mode: 'Remote', salary: '₹4–6 LPA', category: 'Design & Development', logo: 'P', color: 'orange', posted: '1 day ago', description: 'Build responsive user experiences with React, JavaScript, CSS and modern frontend tools.' },
  { id: 3, title: 'Graduate Software Engineer', company: 'CloudSpring', location: 'Bengaluru, Karnataka', type: 'Full-time', mode: 'On-site', salary: '₹6–8 LPA', category: 'Engineering', logo: 'CS', color: 'blue', posted: '3 days ago', description: 'Join a collaborative team building reliable cloud-based products and services.' },
  { id: 4, title: 'Data Analyst Intern', company: 'InsightWorks', location: 'Remote, India', type: 'Internship', mode: 'Remote', salary: '₹10,000–₹15,000/mo', category: 'Data & Analytics', logo: 'IW', color: 'green', posted: '4 days ago', description: 'Help transform data into insights using spreadsheets, SQL and visual dashboards.' },
  { id: 5, title: 'UI/UX Design Intern', company: 'Northstar Digital', location: 'Pune, Maharashtra', type: 'Internship', mode: 'Hybrid', salary: '₹8,000–₹12,000/mo', category: 'Design & Development', logo: 'N', color: 'pink', posted: '5 days ago', description: 'Create user flows, wireframes and polished interfaces for web applications.' },
  { id: 6, title: 'Junior QA Engineer', company: 'BrightByte Systems', location: 'Chennai, Tamil Nadu', type: 'Full-time', mode: 'On-site', salary: '₹3–5 LPA', category: 'Engineering', logo: 'BB', color: 'teal', posted: '1 week ago', description: 'Test web applications, write clear bug reports and work with developers to improve quality.' },
]
const categories = [
  { name: 'Software Development', icon: '⌘', tint: 'lavender', match: ['Engineering', 'Software Development'] },
  { name: 'Data Analytics', icon: '▥', tint: 'mint', match: ['Data & Analytics', 'Data Analytics'] },
  { name: 'Marketing', icon: '↗', tint: 'sky', match: ['Marketing'] },
  { name: 'Design', icon: '✳', tint: 'peach', match: ['Design & Development', 'Design'] },
  { name: 'Finance', icon: '₹', tint: 'lavender', match: ['Finance'] },
]

function App() {
  const [jobs, setJobs] = useState(demoJobs)
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('All categories')
  const [saved, setSaved] = useState([])
  const [applied, setApplied] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [notice, setNotice] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showPostJob, setShowPostJob] = useState(false)
  const [postingJob, setPostingJob] = useState(false)
  const [apiStatus, setApiStatus] = useState('demo')

  useEffect(() => {
    fetch('http://localhost:8080/api/jobs')
      .then(r => { if (!r.ok) throw new Error('API unavailable'); return r.json() })
      .then(data => { if (Array.isArray(data) && data.length) setJobs(data.map(j => ({...j, logo: (j.company || 'J').slice(0,2).toUpperCase(), color: 'blue', posted: j.posted || 'Recently posted', mode: j.mode || 'On-site', salary: j.salary || 'Salary not listed', category: j.category || 'Engineering' }))); setApiStatus('connected') })
      .catch(() => setApiStatus('demo'))
  }, [])

  const filteredJobs = useMemo(() => jobs.filter(job => {
    const q = query.toLowerCase().trim()
    const l = location.toLowerCase().trim()
    const matchesQuery = !q || [job.title, job.company, job.description, job.category].some(v => String(v || '').toLowerCase().includes(q))
    const matchesLocation = !l || String(job.location || '').toLowerCase().includes(l)
    const selectedCategory = categories.find(c => c.name === category)
     const matchesCategory = category === 'All categories' || (selectedCategory ? selectedCategory.match.includes(job.category) : job.category === category)
    return matchesQuery && matchesLocation && matchesCategory
  }), [jobs, query, location, category])

  function applyJob(job) {
    if (applied.includes(job.id)) { setNotice('You have already applied for this job.'); return }
    setApplied(prev => [...prev, job.id]); setNotice(`Application recorded for ${job.title}! (Demo mode)`); setSelectedJob(null)
    window.setTimeout(() => setNotice(''), 4000)
  }
  async function submitJobPost(e) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const newJob = {
      title: String(formData.get('title') || '').trim(),
      company: String(formData.get('company') || '').trim(),
      location: String(formData.get('location') || '').trim(),
      type: String(formData.get('type') || 'Full-time'),
      mode: String(formData.get('mode') || 'On-site'),
      salary: String(formData.get('salary') || '').trim(),
      category: String(formData.get('category') || 'Engineering'),
      description: String(formData.get('description') || '').trim()
    }

    setPostingJob(true)
    try {
      const response = await fetch('http://localhost:8080/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      })
      if (!response.ok) {
        const details = await response.text()
        throw new Error(details || `Server returned ${response.status}`)
      }

      const savedJob = await response.json().catch(() => null)
      const jobsResponse = await fetch('http://localhost:8080/api/jobs')
      if (jobsResponse.ok) {
        const data = await jobsResponse.json()
        if (Array.isArray(data)) {
          setJobs(data.map(j => ({
            ...j,
            logo: (j.company || 'J').slice(0, 2).toUpperCase(),
            color: 'blue',
            posted: j.posted || 'Recently posted',
            mode: j.mode || 'On-site',
            salary: j.salary || 'Salary not listed',
            category: j.category || 'Engineering'
          })))
        }
      } else if (savedJob && typeof savedJob === 'object') {
        setJobs(prev => [...prev, {
          ...savedJob,
          logo: (savedJob.company || 'J').slice(0, 2).toUpperCase(),
          color: 'blue',
          posted: savedJob.posted || 'Recently posted'
        }])
      }
      setApiStatus('connected')
      setShowPostJob(false)
      setNotice('Job posted successfully and sent to the backend.')
      form.reset()
    } catch (error) {
      setNotice(`Could not post job: ${error.message}. Check that the backend supports POST /api/jobs.`)
    } finally {
      setPostingJob(false)
      window.setTimeout(() => setNotice(''), 6000)
    }
  }

  function doSearch() { document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' }) }

  return <div className="app-shell">
    <header className="navbar">
      <a className="brand" href="#top" aria-label="CareerNext home"><img className="brand-logo" src="/careernext-logo.svg" alt="CareerNext" /></a>
      <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
      <nav className={mobileMenu ? 'nav-links open' : 'nav-links'}>
        <a className="active" href="#top" onClick={() => setMobileMenu(false)}>Home</a><a href="#jobs" onClick={() => setMobileMenu(false)}>Find Jobs</a><a href="#internships" onClick={() => setMobileMenu(false)}>Internships</a><a href="#companies" onClick={() => setMobileMenu(false)}>Companies</a><a href="#my-portfolio" onClick={() => setMobileMenu(false)}>My Portfolio</a><a href="#career-resources" onClick={() => setMobileMenu(false)}>Career Resources</a>
      </nav>
      <div className="nav-actions"><button className="login-btn" onClick={() => setShowLogin(true)}>Log in</button><button className="post-btn" onClick={() => setShowPostJob(true)}>Post a job <ArrowUpRight size={16}/></button></div>
    </header>

    <main id="top">
      <section className="hero" aria-label="CareerNext job search">
        <div className="hero-banner">
          <div className="hero-copy">
            <div className="eyebrow">YOUR FUTURE, OUR PRIORITY</div>
            <h1>Your Career<br/><span>Starts Here</span></h1>
            <p className="hero-description">Discover opportunities. Showcase your skills. Build your future.</p>
            <div className="hero-ctas"><a className="hero-primary" href="#jobs">Explore Jobs <ArrowUpRight size={17}/></a><a className="hero-secondary" href="#internships">Find Internships <ArrowUpRight size={17}/></a></div>
          </div>
          <div className="hero-art" aria-hidden="true"><img className="hero-photo" src="/career-hero.jpg" alt=" Career opportunities and professional growth" /></div>
        </div>
        <form className="search-panel hero-search-panel" onSubmit={e => { e.preventDefault(); doSearch() }}>
          <label className="search-field"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Job title, skills or keywords" aria-label="Job title, skills or keywords"/></label>
          <span className="search-divider"/>
          <label className="search-field location-field"><MapPin size={19}/><input value={location} onChange={e => setLocation(e.target.value)} placeholder="City or remote" aria-label="City or remote"/></label>
          <button type="submit" className="search-btn">Search jobs <ArrowUpRight size={17}/></button>
        </form>
        <div className="popular hero-popular"><strong>Popular:</strong>{['React', 'Java Developer', 'Internship', 'Remote'].map(term => <button key={term} onClick={() => { setQuery(term); if(term === 'Remote') setLocation('Remote'); else setLocation(''); doSearch() }}>{term}</button>)}</div>
        <div className="hero-stats"><div><b>{jobs.length}</b><small>Listings in portal</small></div><div><b>{new Set(jobs.map(j => j.company).filter(Boolean)).size}</b><small>Companies represented</small></div><div><b>{jobs.filter(j => String(j.type || '').toLowerCase().includes('intern')).length}</b><small>Internship listings</small></div></div>
      </section>

      <section className="featured-promo section-wrap" id="sponsored-opportunities">
        <div className="featured-promo-heading"><div><h2>Featured Opportunities</h2><p>Explore top jobs, internships, and career programs from leading companies.</p></div><a href="#jobs">View All <ArrowUpRight size={17}/></a></div>
        <div className="promo-grid">
          <article className="promo-card"><div className="promo-card-top"><span className="sponsored-pill">Sponsored</span><strong className="google-wordmark">Google</strong></div><h3>Software Engineer</h3><p className="promo-company">Google</p><ul><li><MapPin size={15}/> Bengaluru, India</li><li><BriefcaseBusiness size={15}/> 0–2 years</li><li><span className="rupee-symbol">₹</span> ₹12 LPA – ₹20 LPA</li><li><Users size={15}/> Work From Office</li></ul><a className="promo-action" href="#jobs">View Details <ArrowUpRight size={16}/></a></article>
          <article className="promo-card"><div className="promo-card-top"><span className="sponsored-pill">Sponsored</span><strong className="microsoft-wordmark"><i></i> Microsoft</strong></div><h3>Software Development Intern</h3><p className="promo-company">Microsoft</p><ul><li><MapPin size={15}/> Hyderabad, India</li><li><BriefcaseBusiness size={15}/> Internship</li><li><span className="rupee-symbol">₹</span> ₹25,000 – ₹40,000 / month</li><li><Users size={15}/> Work From Office</li></ul><a className="promo-action" href="#internships">View Details <ArrowUpRight size={16}/></a></article>
          <article className="promo-card promo-course"><div className="promo-card-top"><span className="sponsored-pill">Sponsored</span><strong className="coursera-wordmark">coursera</strong></div><h3>Data Science Specialization</h3><p className="promo-company">Coursera</p><ul><li><CheckCircle2 size={15}/> Online</li><li><Users size={15}/> Self Paced</li><li><span className="rupee-symbol">₹</span> ₹6,999</li><li><BriefcaseBusiness size={15}/> Certificate</li></ul><a className="promo-action" href="#career-resources">Learn More <ArrowUpRight size={16}/></a></article>
          <article className="promo-card promo-ad"><div className="promo-card-top"><span className="advertisement-pill">Advertisement</span><strong className="tcs-wordmark">tcs <small>TATA<br/>CONSULTANCY<br/>SERVICES</small></strong></div><h3>Kickstart Your Future</h3><p className="promo-description">Explore exciting opportunities at TCS</p><div className="tcs-banner"><b>Build. Grow.<br/>Belong.</b><span>Career opportunities await</span></div><a className="promo-action" href="#companies">Know More <ArrowUpRight size={16}/></a></article>
        </div>
      </section>

      <section className="categories section-wrap" id="categories"><div className="section-heading"><div><span className="section-kicker">EXPLORE BY INTEREST</span><h2>Popular categories</h2></div><a className="text-link" href="#jobs">Explore all jobs <ArrowUpRight size={16}/></a></div><div className="category-grid">{categories.map(c => <button className="category-card" key={c.name} onClick={() => { setCategory(c.name); doSearch() }}><span className={`category-icon ${c.tint}`}>{c.icon}</span><span className="category-info"><b>{c.name}</b><small>{jobs.filter(j => c.match.includes(j.category)).length} listed opportunities</small></span><ArrowUpRight className="category-arrow" size={18}/></button>)}</div></section>

      <section className="jobs-section section-wrap" id="jobs"><div className="section-heading jobs-heading"><div><span className="section-kicker">HANDPICKED FOR YOU</span><h2>Featured jobs</h2><p className="section-subtitle">Find a role where you can do your best work.</p></div><label className="category-select"><span className="sr-only">Filter by category</span><select value={category} onChange={e => setCategory(e.target.value)}><option>All categories</option>{categories.map(c => <option key={c.name}>{c.name}</option>)}</select><ChevronDown size={16}/></label></div>
        <div className="jobs-meta"><span><b>{filteredJobs.length}</b> opportunities</span><span className={`api-badge ${apiStatus}`}>{apiStatus === 'connected' ? '● Connected to backend' : '● Preview listings'}</span></div>
        <div className="job-grid">{filteredJobs.map(job => <article className="job-card" key={job.id}><div className="job-card-top"><span className={`company-logo ${job.color || 'blue'}`}>{job.logo || String(job.company || 'J').slice(0,2).toUpperCase()}</span><button className={saved.includes(job.id) ? 'save-btn saved' : 'save-btn'} aria-label={saved.includes(job.id) ? 'Unsave job' : 'Save job'} onClick={() => setSaved(prev => prev.includes(job.id) ? prev.filter(id => id !== job.id) : [...prev, job.id])}><Bookmark size={18} fill={saved.includes(job.id) ? 'currentColor' : 'none'}/></button></div><span className="job-type">{job.type || 'Full-time'}</span><h3>{job.title}</h3><p className="company-name">{job.company}</p><div className="job-details"><span><MapPin size={15}/>{job.location}</span><span><Clock3 size={15}/>{job.mode}</span></div><p className="job-description">{job.description}</p><div className="job-card-footer"><div><b>{job.salary}</b><small>{job.posted}</small></div><button className="details-btn" onClick={() => setSelectedJob(job)} aria-label={`View ${job.title}`}> <ArrowUpRight size={19}/></button></div></article>)}</div>
        {filteredJobs.length === 0 && <div className="empty-state"><Search size={30}/><h3>No jobs found</h3><p>Try another keyword, location, or category.</p><button onClick={() => {setQuery('');setLocation('');setCategory('All categories')}}>Clear filters</button></div>}
        <div className="jobs-bottom"><span>Showing {filteredJobs.length} of {jobs.length} listings</span><button onClick={() => {setQuery('');setLocation('');setCategory('All categories')}}>Reset filters</button></div>
      </section>

      <section className="section-wrap extra-section" id="internships">
        <div className="section-heading"><div><span className="section-kicker">START YOUR CAREER</span><h2>Internships to build your future</h2><p className="section-subtitle">Explore internship listings currently available in the portal.</p></div><a className="text-link" href="#jobs" onClick={() => { setQuery('Intern'); setCategory('All categories') }}>View internships <ArrowUpRight size={16}/></a></div>
        <div className="mini-list">{jobs.filter(j => String(j.type || '').toLowerCase().includes('intern')).slice(0,4).map(job => <button className="mini-job" key={job.id} onClick={() => setSelectedJob(job)}><span className={`company-logo ${job.color || 'blue'}`}>{job.logo || 'J'}</span><span className="mini-job-info"><b>{job.title}</b><small>{job.company} · {job.location}</small></span><span className="mini-job-type">{job.type || 'Internship'}</span><ArrowUpRight size={17}/></button>)}{jobs.filter(j => String(j.type || '').toLowerCase().includes('intern')).length === 0 && <p className="empty-inline">No internship listings are currently available from the connected data.</p>}</div>
      </section>
      <section className="companies-section" id="companies"><div className="section-wrap"><div className="section-heading"><div><span className="section-kicker">EMPLOYERS ON CAREERNEXT</span><h2>Companies hiring</h2><p className="section-subtitle">Companies represented by the current job listings.</p></div></div><div className="company-strip">{[...new Set(jobs.map(j => j.company).filter(Boolean))].slice(0,6).map((company, i) => <div className="company-chip" key={company}><span className={`company-logo ${['blue','green','violet','orange','teal','pink'][i%6]}`}>{company.slice(0,2).toUpperCase()}</span><b>{company}</b></div>)}</div></div></section>
      <section className="section-wrap extra-section latest-section" id="latest-jobs"><div className="section-heading"><div><span className="section-kicker">FRESH OPPORTUNITIES</span><h2>Latest jobs</h2><p className="section-subtitle">Recent listings from the available job feed.</p></div><a className="text-link" href="#jobs">Browse listings <ArrowUpRight size={16}/></a></div><div className="latest-list">{[...jobs].slice(-3).reverse().map(job => <button className="latest-row" key={job.id} onClick={() => setSelectedJob(job)}><span><b>{job.title}</b><small>{job.company} · {job.location}</small></span><span className="latest-salary">{job.salary || 'Salary not listed'}</span><ArrowUpRight size={17}/></button>)}</div></section>
      <section className="section-wrap trust-section"><div className="section-heading"><div><span className="section-kicker">BUILT FOR YOUR NEXT STEP</span><h2>A clearer path to opportunity</h2><p className="section-subtitle">CareerNext is a student project focused on making job and internship discovery easier.</p></div></div><div className="trust-cards"><article><span>01</span><h3>Search with focus</h3><p>Search available listings by role keywords, company, and location.</p></article><article><span>02</span><h3>Compare opportunities</h3><p>Review job type, work mode, location, and compensation when provided.</p></article><article><span>03</span><h3>Take the next step</h3><p>Open a listing to review details and try the application preview.</p></article></div></section>
      <Portfolio />
      <section className="career-resources" id="career-resources"><div className="section-wrap resource-inner"><div><span className="section-kicker">CAREER RESOURCES</span><h2>Make your next move with confidence.</h2><p>Prepare a focused resume, practice interviews, and keep learning the skills employers are looking for.</p></div><a className="post-btn" href="#how-it-works">Explore career tips <ArrowUpRight size={16}/></a></div></section>
      <section className="how-section" id="how-it-works"><div className="section-wrap how-inner"><div className="how-copy"><span className="section-kicker">YOUR SEARCH, SIMPLIFIED</span><h2>A better job search<br/>starts with CareerNext.</h2><p>Less scrolling, more possibilities. Take the next step toward a career that feels right.</p><a href="#jobs" className="post-btn how-cta">Explore opportunities <ArrowUpRight size={16}/></a></div><div className="steps"><div className="step"><span>01</span><div><h3>Discover opportunities</h3><p>Search roles by title, skill, or location and explore opportunities that fit.</p></div></div><div className="step"><span>02</span><div><h3>Find your fit</h3><p>Review role details, work style, and salary information before applying.</p></div></div><div className="step"><span>03</span><div><h3>Take the next step</h3><p>Save roles you like and track your applications as you move forward.</p></div></div></div></div></section>
    </main>

    <footer className="footer"><div className="footer-main"><a className="brand footer-brand" href="#top"><img className="brand-logo" src="/careernext-logo.svg" alt="CareerNext" /></a><p>Helping you discover opportunities and take your next career step.</p></div><div className="footer-links"><a href="#career-resources">About Us</a><a href="mailto:hello@careernext.example">Contact</a><a href="#privacy" onClick={e => { e.preventDefault(); setNotice('Privacy: this student-project preview stores saved jobs and demo applications in the current browser session.'); window.setTimeout(() => setNotice(''), 5000) }}>Privacy Policy</a><a href="#terms" onClick={e => { e.preventDefault(); setNotice('Terms: listings and application actions are a student-project preview, not a live recruitment service.'); window.setTimeout(() => setNotice(''), 5000) }}>Terms and Conditions</a></div><span className="copyright">© 2026 CareerNext · Student project</span></footer>

    {notice && <div className="toast" role="status"><CheckCircle2 size={18}/>{notice}<button onClick={() => setNotice('')} aria-label="Dismiss">×</button></div>}
    {showPostJob && <div className="modal-backdrop" onClick={() => !postingJob && setShowPostJob(false)}><section className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 620, maxHeight: '90vh', overflowY: 'auto' }}><button className="modal-close" onClick={() => !postingJob && setShowPostJob(false)} aria-label="Close"><X/></button><span className="brand-mark"><BriefcaseBusiness size={21}/></span><h2>Post a job</h2><p className="modal-description">Enter the role details. Submitting sends them to your CareerNext backend.</p><form onSubmit={submitJobPost} style={{ display: 'grid', gap: 12 }}><label className="login-label">Job title<input name="title" required placeholder="e.g. Java Developer Intern"/></label><label className="login-label">Company<input name="company" required placeholder="Company name"/></label><label className="login-label">Location<input name="location" required placeholder="e.g. Hyderabad, Telangana or Remote, India"/></label><label className="login-label">Job type<select name="type" defaultValue="Full-time"><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option></select></label><label className="login-label">Work mode<select name="mode" defaultValue="On-site"><option>On-site</option><option>Hybrid</option><option>Remote</option></select></label><label className="login-label">Salary<input name="salary" required placeholder="e.g. ₹4–6 LPA"/></label><label className="login-label">Category<select name="category" defaultValue="Engineering"><option>Engineering</option><option>Design & Development</option><option>Data & Analytics</option><option>Marketing</option></select></label><label className="login-label">Job description<textarea name="description" required rows="4" placeholder="Describe the role and responsibilities." style={{ width: '100%', resize: 'vertical' }}/></label><button type="submit" className="post-btn apply-btn" disabled={postingJob}>{postingJob ? 'Submitting…' : 'Submit job'} <ArrowUpRight size={17}/></button></form><p className="demo-note">If submission fails, check the backend terminal for the exact API error.</p></section></div>}
    {selectedJob && <div className="modal-backdrop" onClick={() => setSelectedJob(null)}><section className="modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedJob(null)} aria-label="Close"><X/></button><span className={`company-logo large ${selectedJob.color || 'blue'}`}>{selectedJob.logo || 'J'}</span><span className="job-type">{selectedJob.type || 'Full-time'}</span><h2>{selectedJob.title}</h2><p className="company-name">{selectedJob.company}</p><div className="modal-facts"><span><MapPin size={16}/>{selectedJob.location}</span><span><BriefcaseBusiness size={16}/>{selectedJob.mode}</span></div><h3>About this role</h3><p className="modal-description">{selectedJob.description}</p><div className="salary-box"><small>Compensation</small><b>{selectedJob.salary}</b></div><button className="post-btn apply-btn" onClick={() => applyJob(selectedJob)}>{applied.includes(selectedJob.id) ? 'Application recorded' : 'Apply for this job'} <ArrowUpRight size={17}/></button><p className="demo-note">Demo project: applications are stored in this browser session only.</p></section></div>}
    {showLogin && <div className="modal-backdrop" onClick={() => setShowLogin(false)}><section className="modal login-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setShowLogin(false)} aria-label="Close"><X/></button><span className="brand-mark"><Users size={21}/></span><h2>Welcome to CareerNext</h2><p className="modal-description">Login and registration will be connected to the backend in the next development step.</p><label className="login-label">Email address<input type="email" placeholder="you@example.com"/></label><label className="login-label">Password<input type="password" placeholder="Enter your password"/></label><button className="post-btn apply-btn" onClick={() => {setShowLogin(false);setNotice('Login is a UI preview for now. Backend authentication is the next step.');window.setTimeout(() => setNotice(''), 4000)}}>Continue <ArrowUpRight size={17}/></button><p className="demo-note">Preview only — authentication is not active yet.</p></section></div>}
  </div>
}
export default App
