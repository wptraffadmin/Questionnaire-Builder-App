import { Link } from 'react-router-dom';
import styles from './Navigate.module.css';

const Navigate = () => {
  return (
    <div className={styles.container}>
      <Link to='/' className={styles.logoLink}>
        <span className={styles.logo}>qb</span>
        <span className={styles.logoText}>Questionnaire Builder</span>
      </Link>
      <button className={styles.button}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.25rem"
        height="1.25rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19v-7m0 0V5m0 7H5m7 0h7"></path>
      </svg>
        <Link className={styles.link} to='/create'>Create</Link>
      </button>
    </div>
    
  );
};

export default Navigate;

