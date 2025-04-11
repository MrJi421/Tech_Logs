import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../css/Search.css';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const searchBlogs = async () => {
            if (!query) return;
            
            setLoading(true);
            setError('');

            try {
                const response = await fetch(`http://localhost:5000/search-blogs?q=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('Failed to search blogs');
                
                const data = await response.json();
                setResults(data.blogs);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        searchBlogs();
    }, [query]);

    return (
        <div className="search-results-container">
            <h2>Search Results for: {query}</h2>
            
            {loading && <div className="loading">Searching...</div>}
            {error && <div className="error">{error}</div>}
            
            <div className="search-results">
                {results.length === 0 ? (
                    <p className="no-results">No blogs found matching your search.</p>
                ) : (
                    results.map(blog => (
                        <article key={blog._id} className="search-result-card">
                            {blog.image_url && (
                                <img src={blog.image_url} alt={blog.title} className="result-image" />
                            )}
                            <div className="result-content">
                                <h3>{blog.title}</h3>
                                <p>{blog.content.substring(0, 150)}...</p>
                                <Link to={`/view-blog/${blog._id}`} className="read-more">
                                    Read More
                                </Link>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
};

export default Search;