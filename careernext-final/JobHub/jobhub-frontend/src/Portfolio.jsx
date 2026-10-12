import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ExternalLink, FolderGit2, Globe2, LockKeyhole, Pencil, Plus, Trash2, Upload, X } from 'lucide-react'
import './Portfolio.css'

const STORAGE_KEY = 'careernext-portfolio-v1'
const emptyProfile = { name: '', headline: '', skills: '', education: '', certifications: '', contactPreference: 'Platform messages only' }
const emptyProject = { title: '', description: '', technologies: '', role: '', repositoryUrl: '', demoUrl: '', status: 'Completed', visibility: 'Public', image: '' }
const safeExternalUrl = (value) => {
  if (!value.trim()) return ''
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null } catch { return null }
}

function Portfolio() {
  const [profile, setProfile] = useState(emptyProfile)
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(emptyProject)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [publicProfile, setPublicProfile] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (stored) { setProfile({ ...emptyProfile, ...(stored.profile || {}) }); setProjects(Array.isArray(stored.projects) ? stored.projects : []); setPublicProfile(Boolean(stored.publicProfile)) }
    } catch { /* Ignore malformed browser-local data and start with an empty portfolio. */ }
  }, [])
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, projects, publicProfile })) }
    catch { setMessage('Browser storage is full. Try removing a large project screenshot.') }
  }, [profile, projects, publicProfile])

  const visibleProjects = useMemo(() => projects.filter(project => publicProfile && project.visibility === 'Public'), [projects, publicProfile])
  function notify(text) { setMessage(text); window.setTimeout(() => setMessage(''), 3500) }
  function openNew() { setEditing(null); setDraft({ ...emptyProject }); setShowForm(true) }
  function openEdit(project) { setEditing(project.id); setDraft({ ...project }); setShowForm(true) }
  async function chooseImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { notify('Choose a JPG, PNG, or WebP image.'); event.target.value = ''; return }
    if (file.size > 2 * 1024 * 1024) { notify('Screenshots must be 2 MB or smaller.'); event.target.value = ''; return }
    const reader = new FileReader()
    reader.onload = () => setDraft(prev => ({ ...prev, image: String(reader.result || '') }))
    reader.onerror = () => notify('Could not read that image.')
    reader.readAsDataURL(file)
  }
  function saveProject(event) {
    event.preventDefault()
    const repo = safeExternalUrl(draft.repositoryUrl)
    const demo = safeExternalUrl(draft.demoUrl)
    if (repo === null || demo === null) { notify('Repository and demo links must be valid HTTP or HTTPS URLs.'); return }
    const project = { ...draft, repositoryUrl: repo, demoUrl: demo, id: editing ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, technologies: draft.technologies.split(',').map(x => x.trim()).filter(Boolean) }
    setProjects(prev => editing ? prev.map(item => item.id === editing ? project : item) : [...prev, project])
    setShowForm(false); notify(editing ? 'Project updated in this browser.' : 'Project added to your portfolio.')
  }
  function moveProject(index, direction) {
    const target = index + direction
    if (target < 0 || target >= projects.length) return
    setProjects(prev => { const copy = [...prev]; [copy[index], copy[target]] = [copy[target], copy[index]]; return copy })
  }
  function deleteProject(id) {
    if (!window.confirm('Delete this project from your portfolio?')) return
    setProjects(prev => prev.filter(project => project.id !== id)); notify('Project deleted.')
  }

  return <section className="portfolio-section" id="my-portfolio">
    <div className="section-wrap">
      <div className="section-heading portfolio-heading"><div><span className="section-kicker">YOUR CAREER, YOUR STORY</span><h2>Build your project portfolio.</h2><p className="section-subtitle">Show employers what you can build, the skills you use, and the role you played.</p></div><button className="post-btn" onClick={openNew}><Plus size={16}/> Add project</button></div>
      <div className="portfolio-layout">
        <form className="portfolio-profile" onSubmit={e => { e.preventDefault(); notify('Profile details saved in this browser.') }}>
          <div className="portfolio-panel-title"><span className="portfolio-icon"><FolderGit2 size={20}/></span><div><h3>Portfolio profile</h3><p>Keep your career details ready to share.</p></div></div>
          <label>Full name<input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your name" maxLength={100}/></label>
          <label>Professional headline<input value={profile.headline} onChange={e => setProfile(p => ({ ...p, headline: e.target.value }))} placeholder="e.g. Computer Science student" maxLength={140}/></label>
          <label>Skills <small>Separate with commas</small><textarea value={profile.skills} onChange={e => setProfile(p => ({ ...p, skills: e.target.value }))} placeholder="React, Java, SQL" rows={2} maxLength={600}/></label>
          <label>Education<textarea value={profile.education} onChange={e => setProfile(p => ({ ...p, education: e.target.value }))} placeholder="Degree, institution, graduation year" rows={2} maxLength={600}/></label>
          <label>Certifications<textarea value={profile.certifications} onChange={e => setProfile(p => ({ ...p, certifications: e.target.value }))} placeholder="Add certifications you actually hold" rows={2} maxLength={600}/></label>
          <label>Contact preference<select value={profile.contactPreference} onChange={e => setProfile(p => ({ ...p, contactPreference: e.target.value }))}><option>Platform messages only</option><option>Professional email</option><option>Do not display contact details</option></select></label>
          <button className="portfolio-save" type="submit">Save profile details</button>
          <div className="portfolio-privacy"><LockKeyhole size={16}/><span>Privacy first: your portfolio data is stored in this browser in this preview. It is not yet connected to account authentication or a server database.</span></div>
        </form>
        <div className="portfolio-projects">
          <div className="portfolio-visibility"><div><h3>Projects <span>{projects.length}</span></h3><p>Choose which projects are included in your public preview.</p></div><label className="portfolio-toggle"><input type="checkbox" checked={publicProfile} onChange={e => setPublicProfile(e.target.checked)}/><span>{publicProfile ? <Globe2 size={16}/> : <LockKeyhole size={16}/>} {publicProfile ? 'Public preview on' : 'Private preview'}</span></label></div>
          {projects.length === 0 ? <div className="portfolio-empty"><span><FolderGit2 size={28}/></span><h3>Your projects will appear here</h3><p>Add a class project, personal build, hackathon entry, or open-source contribution.</p><button className="portfolio-outline" onClick={openNew}><Plus size={15}/> Add your first project</button></div> : <div className="portfolio-project-list">{projects.map((project, index) => <article className="portfolio-project-card" key={project.id}>
            {project.image ? <img className="portfolio-project-image" src={project.image} alt={`${project.title} screenshot`}/> : <div className="portfolio-project-placeholder"><FolderGit2 size={24}/></div>}
            <div className="portfolio-project-body"><div className="portfolio-project-top"><span className="portfolio-status">{project.status}</span><span className={project.visibility === 'Public' ? 'portfolio-visibility-tag' : 'portfolio-private-tag'}>{project.visibility === 'Public' ? 'Public' : 'Private'}</span></div><h4>{project.title}</h4><p>{project.description}</p>{project.role && <p><b>Your contribution:</b> {project.role}</p>}<div className="portfolio-tags">{(Array.isArray(project.technologies) ? project.technologies : []).map(skill => <span key={skill}>{skill}</span>)}</div><div className="portfolio-project-links">{project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer">GitHub / Repository <ExternalLink size={13}/></a>}{project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer">Live demo <ExternalLink size={13}/></a>}</div><div className="portfolio-project-actions"><button onClick={() => moveProject(index, -1)} disabled={index === 0} aria-label="Move project up"><ArrowUp size={15}/></button><button onClick={() => moveProject(index, 1)} disabled={index === projects.length - 1} aria-label="Move project down"><ArrowDown size={15}/></button><button onClick={() => openEdit(project)}><Pencil size={14}/> Edit</button><button onClick={() => deleteProject(project.id)}><Trash2 size={14}/> Delete</button></div></div>
          </article>)}</div>}
          {publicProfile && <div className="portfolio-public-note"><Globe2 size={17}/><div><b>Public preview enabled on this device</b><p>{visibleProjects.length} project(s) marked Public are shown above. A shareable public URL will require account-backed routing and a server API.</p></div></div>}
        </div>
      </div>
      {message && <div className="portfolio-message" role="status">{message}<button onClick={() => setMessage('')} aria-label="Dismiss message"><X size={14}/></button></div>}
    </div>
    {showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><section className="modal portfolio-modal" onClick={e => e.stopPropagation()} aria-labelledby="project-form-title"><button className="modal-close" onClick={() => setShowForm(false)} aria-label="Close"><X/></button><span className="section-kicker">PROJECT DETAILS</span><h2 id="project-form-title">{editing ? 'Edit project' : 'Add a project'}</h2><p className="modal-description">Describe what you built and your own contribution. Do not include private credentials in project details.</p><form onSubmit={saveProject} className="portfolio-form-grid">
      <label>Project title<input required maxLength={120} value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Student expense tracker"/></label>
      <label>Project status<select value={draft.status} onChange={e => setDraft(p => ({ ...p, status: e.target.value }))}><option>Completed</option><option>In progress</option><option>Planned</option></select></label>
      <label className="portfolio-full">Description<textarea required rows={3} maxLength={1600} value={draft.description} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))} placeholder="What does it do? What problem does it solve?"/></label>
      <label className="portfolio-full">Technologies <small>Comma-separated</small><input value={draft.technologies} onChange={e => setDraft(p => ({ ...p, technologies: e.target.value }))} placeholder="React, Spring Boot, MySQL" maxLength={400}/></label>
      <label className="portfolio-full">Your role and contribution<textarea rows={2} value={draft.role} onChange={e => setDraft(p => ({ ...p, role: e.target.value }))} maxLength={800} placeholder="Explain what you personally implemented"/></label>
      <label>Repository URL<input type="url" value={draft.repositoryUrl} onChange={e => setDraft(p => ({ ...p, repositoryUrl: e.target.value }))} placeholder="https://github.com/…"/></label>
      <label>Live demo URL<input type="url" value={draft.demoUrl} onChange={e => setDraft(p => ({ ...p, demoUrl: e.target.value }))} placeholder="https://…"/></label>
      <label>Visibility<select value={draft.visibility} onChange={e => setDraft(p => ({ ...p, visibility: e.target.value }))}><option>Public</option><option>Private</option></select></label>
      <label>Project screenshot <small>JPG, PNG or WebP; max 2 MB</small><span className="portfolio-upload"><Upload size={15}/><input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage}/></span></label>
      {draft.image && <div className="portfolio-full portfolio-image-preview"><img src={draft.image} alt="Selected project screenshot preview"/><button type="button" className="portfolio-outline" onClick={() => setDraft(p => ({ ...p, image: '' }))}>Remove screenshot</button></div>}
      <div className="portfolio-full portfolio-form-actions"><button type="button" className="portfolio-cancel" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="portfolio-save">{editing ? 'Save changes' : 'Add project'}</button></div>
    </form></section></div>}
  </section>
}
export default Portfolio
