import { Link } from 'react-router-dom';
import "../styles/homepage.css"
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="flex-wrapper" style={{ height: '100%' }}>
      <NavBar />
        <div className="container my-5">
            <div className="p-5 bg-body-tertiary rounded-4">
                <h1 className="text-body-emphasis fw-bold">OneOnOne</h1>
                <p className="col-lg-8 fs-5 text-muted">
                    Revolutionize your meeting schedules with 1on1 – your ultimate platform for effortlessly
                    organizing and managing one-on-one meetings.
                </p>
                <hr className="my-4" />
                <p>
                    Get started today! 
                </p>
                <Link to="/signup" className="btn btn-success btn-lg">Sign Up</Link>
            </div>
        </div>
        <Footer />
    </div>
  );
};

export default Home;
