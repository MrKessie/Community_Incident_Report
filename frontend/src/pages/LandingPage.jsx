import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const highlights = [
  {
    title: 'Real-Time Monitoring',
    description: 'Track incidents from report to completion with live updates and clear stage visibility.',
  },
  {
    title: 'Fast Team Coordination',
    description: 'Assign maintenance teams quickly and manage operational flow from a single workboard.',
  },
  {
    title: 'Actionable Reporting',
    description: 'Export operational data for daily summaries, audits, and management reviews.',
  },
];

const flowSteps = [
  {
    step: '01',
    title: 'Report Incident',
    description: 'Residents or citizens submit incident details, location, and evidence photo.',
  },
  {
    step: '02',
    title: 'Assign and Update',
    description: 'Admins assign a maintenance team and update status from the management workflow.',
  },
  {
    step: '03',
    title: 'Resolve and Export',
    description: 'Finalize incident lifecycle, monitor metrics, and export reports for decision-making.',
  },
];

const containerMotion = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
    },
  },
};

const itemMotion = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function LandingPage() {
  return (
    <motion.main className="landing-shell" initial="hidden" animate="show" variants={containerMotion}>
      <motion.section className="landing-hero" variants={containerMotion}>
        <motion.div className="landing-hero-content" variants={itemMotion}>
          <p className="landing-eyebrow">Community Incident Reporting</p>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}>
            Manage incidents with clarity, speed, and confidence.
          </motion.h1>
          <p className="landing-lead">
            CIR System helps operations teams track incident flow, coordinate assignments, and keep
            response timelines under control.
          </p>
          <div className="landing-cta-row">
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link className="landing-btn primary" to="/login">
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link className="landing-btn secondary" to="/register">
                Create Account
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.aside
          className="landing-hero-panel"
          variants={itemMotion}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <h2>Live Operations Snapshot</h2>
          <div className="landing-metric-grid">
            <motion.article whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <p>Reported Today</p>
              <strong>28</strong>
            </motion.article>
            <motion.article whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <p>In Progress</p>
              <strong>9</strong>
            </motion.article>
            <motion.article whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <p>Resolved</p>
              <strong>17</strong>
            </motion.article>
            <motion.article whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <p>Avg Response</p>
              <strong>34 min</strong>
            </motion.article>
          </div>
        </motion.aside>
      </motion.section>

      <motion.section
        className="landing-section"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerMotion}
      >
        <motion.header className="landing-section-head" variants={itemMotion}>
          <p className="landing-eyebrow">Why CIR System</p>
          <h2>Built for practical incident response</h2>
        </motion.header>
        <motion.div className="landing-card-grid" variants={containerMotion}>
          {highlights.map((item) => (
            <motion.article
              key={item.title}
              className="landing-card"
              variants={itemMotion}
              whileHover={{ y: -4, boxShadow: '0 20px 34px rgba(10, 22, 22, 0.14)' }}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="landing-section"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerMotion}
      >
        <motion.header className="landing-section-head" variants={itemMotion}>
          <p className="landing-eyebrow">Workflow</p>
          <h2>From report to resolution in three steps</h2>
        </motion.header>
        <motion.div className="landing-flow-grid" variants={containerMotion}>
          {flowSteps.map((item) => (
            <motion.article
              key={item.step}
              className="landing-flow-card"
              variants={itemMotion}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="landing-bottom-cta"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2>Ready to streamline incident operations?</h2>
        <p>Access your dashboard to start managing reports, assignments, and response timelines.</p>
        <div className="landing-cta-row center">
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link className="landing-btn primary" to="/dashboard">
              Open Dashboard
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link className="landing-btn ghost" to="/incidents/report">
              Report Incident
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
}

export default LandingPage;
