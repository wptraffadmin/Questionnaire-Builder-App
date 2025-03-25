import { Link } from 'react-router-dom';
import styles from './Navigate.module.css';

const Navigate = () => {
  return (
    <div className={styles.container}>
      <Link to='/' className={styles.logo}>
        Questionnaire Builder
      </Link>
      <button className={styles.button}>
        <Link className={styles.link} to='/create'>Create</Link>
      </button>
    </div>
    
  );
};

export default Navigate;

