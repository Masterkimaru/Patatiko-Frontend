import { Link } from 'react-router-dom';

const ShowCard = ({ show }) => (
  <div className="show-card">
    <img src={show.image} alt={show.name} />
    <h2>{show.name}</h2>
    <p>{show.description}</p>
    <Link to={`/shows/${show.id}`} className="btn">
      View Details
    </Link>
  </div>
);

export default ShowCard;
