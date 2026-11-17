import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Search,
  Eye,
  Layers,
  Sparkles,
  Database
} from 'lucide-react';
import ProjectModal from './ProjectModal';
import styles from './Projects.module.css';

const fallbackProjects = [
  {
    id: 1,
    title: 'AI-Powered Evangadi Forum',
    slug: 'ai-powered-forum',
    description: 'A full-featured developer community Q&A platform built on the MERN stack with automated AI assistant responses.',
    long_description: 'The AI-Powered Evangadi Forum facilitates technical discussions among developers and students. Features automated AI query responses, categorized thread feeds, question upvotes, user authentication, and responsive mobile architecture.',
    image_url: '/assets/img/portfolio/ai-forum.jpg',
    github_url: 'https://github.com',
    live_url: 'https://ai-powered-forum-project-delta.vercel.app/',
    technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'AI Assistant API', 'Vercel'],
    category: 'mern',
    featured: 1
  },
  {
    id: 2,
    title: 'ChatGPT Clone Web App',
    slug: 'chatgpt-clone',
    description: 'A fast, modern conversational AI web application featuring real-time stream responses, prompt history, and dark mode UI.',
    long_description: 'Interactive AI chat interface mirroring OpenAI ChatGPT. Includes dynamic prompt session drawers, code block syntax highlighting, multi-turn conversation memory, and clean obsidian dark theme styling.',
    image_url: '/assets/img/portfolio/chatgpt-clone.jpg',
    github_url: 'https://github.com',
    live_url: 'https://chat-gpt-clone-eta-one.vercel.app/',
    technologies: ['React.js', 'Node.js', 'OpenAI API', 'Modern CSS', 'Vercel'],
    category: 'ai',
    featured: 1
  },
  {
    id: 3,
    title: 'Netflix Streaming Clone',
    slug: 'netflix-clone',
    description: 'High-fidelity entertainment streaming application with dynamic TMDB movie catalogs, hero trailers, and carousels.',
    long_description: 'A recreation of the Netflix streaming platform UI with live data from The Movie Database (TMDB). Features dynamic category rows, hero preview video banners, YouTube trailer playback modals, and responsive layout.',
    image_url: '/assets/img/portfolio/netflix-clone.jpg',
    github_url: 'https://github.com',
    live_url: 'https://netflix-clone-ivory-two.vercel.app/',
    technologies: ['React.js', 'TMDB REST API', 'Axios', 'YouTube API', 'Vercel'],
    category: 'react',
    featured: 1
  }
];

export default function Projects() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [dataSource, setDataSource] = useState('Local Cache');

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.length > 0) {
            setProjects(data.data);
            setDataSource(data.source === 'mysql' ? 'MySQL Database' : 'Backend Cache');
          }
        }
      } catch (err) {
        setDataSource('Local Cache');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const categories = [
    { id: 'all', label: 'All Projects (3)' },
    { id: 'mern', label: 'MERN & Full Stack' },
    { id: 'ai', label: 'AI-Powered' },
    { id: 'react', label: 'React Web Apps' },
  ];

  const filteredProjects = projects.filter((project) => {
    const techString = (Array.isArray(project.technologies)
      ? project.technologies.join(' ')
      : typeof project.technologies === 'string'
      ? project.technologies
      : '').toLowerCase();

    const matchesCategory =
      activeCategory === 'all' ||
      project.category?.toLowerCase() === activeCategory.toLowerCase() ||
      (activeCategory === 'ai' && (project.title.toLowerCase().includes('ai') || techString.includes('ai') || techString.includes('openai'))) ||
      (activeCategory === 'mern' && (project.category === 'mern' || techString.includes('mongodb') || techString.includes('node'))) ||
      (activeCategory === 'react' && techString.includes('react'));

    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      techString.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-subtitle">
            <FolderGit2 size={16} />
            <span>Featured Portfolio Works</span>
          </div>
          <div className={styles.titleRow}>
            <h2 className="section-title">
              Crafted With <span className="gradient-text">Precision &amp; Passion</span>
            </h2>
            <div className={styles.dbBadgePill} title="Data source for project catalog">
              <Database size={13} className="text-emerald" />
              <span>Source: {dataSource}</span>
            </div>
          </div>
          <p className="section-description">
            Explore live deployed web applications demonstrating full-stack MERN engineering, RESTful APIs, and dynamic interactive client interfaces.
          </p>
        </div>

        {/* Controls Bar: Category Filters & Search */}
        <div className={styles.projectsControls}>
          <div className={styles.categoryFilters}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by tech or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className={styles.projectsGrid}>
          {filteredProjects.map((project) => {
            const techs = Array.isArray(project.technologies)
              ? project.technologies
              : typeof project.technologies === 'string'
              ? JSON.parse(project.technologies || '[]')
              : [];

            return (
              <div key={project.id || project.slug} className={`${styles.projectCard} glass-panel`}>
                {/* Image Banner */}
                <div className={styles.cardImageWrap}>
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className={styles.cardImg}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className={styles.imageOverlay}>
                    <button
                      className={styles.overlayBtn}
                      onClick={() => setSelectedProject(project)}
                      title="Inspect Architecture"
                    >
                      <Eye size={18} />
                      <span>Details</span>
                    </button>
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.overlayBtn} ${styles.overlayPrimary}`}
                        title="Open Live App"
                      >
                        <ExternalLink size={18} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                  <div className={styles.categoryTagFloat}>
                    {project.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.projectHeading}>{project.title}</h3>
                  <p className={styles.projectBlurb}>{project.description}</p>

                  {/* Tech Tags */}
                  <div className={styles.techTags}>
                    {techs.slice(0, 4).map((tech, idx) => (
                      <span key={idx} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                    {techs.length > 4 && (
                      <span className={`${styles.techTag} ${styles.more}`}>+{techs.length - 4}</span>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className={styles.cardFooter}>
                    <button
                      className={styles.btnLink}
                      onClick={() => setSelectedProject(project)}
                    >
                      <Layers size={15} />
                      <span>Architecture Breakdown</span>
                    </button>
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnLive}
                      >
                        <Sparkles size={14} />
                        <span>Live App</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className={`${styles.emptyState} glass-panel`}>
            <p>No projects match your current filter or search criteria.</p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Modal Inspector */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
