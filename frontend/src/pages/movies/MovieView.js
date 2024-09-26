import { useParams } from 'react-router-dom';
import { movies } from './movieData'; // 더미 데이터가 있는 파일을 가져온다고 가정

function MovieView() {
    const { id } = useParams(); // id는 영화 ID를 의미
    const movie = movies.find((m) => m.id === parseInt(id));

    if (!movie) {
    return <div>Movie not found!</div>;
    }

    return (
    <div>
        <h1>{movie.title}</h1>
        <img src={movie.imageUrl} alt={movie.title} />
        <p><strong>Director:</strong> {movie.director}</p>
        <p><strong>Release Date:</strong> {movie.releaseDate}</p>
        <p><strong>Genres:</strong> {movie.genres.join(", ")}</p>
        <p>{movie.description}</p>
    </div>
    );
}

export default MovieView;