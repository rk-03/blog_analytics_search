
import React, { useEffect, useState } from 'react';
import _ from 'lodash';

function App() {
  const [blogStats, setBlogStats] = useState(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    fetchStats();
  }, []);


  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log("blog analytics");
      const data = await response.json();
      setBlogStats(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchBlogSearchResults = async (queryParams) => {
    try {
      const searchUrl = `http://localhost:5000/api/blog-search?query=${queryParams}`;
      console.log('Search URL:', searchUrl);

      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log("search fetched");
      const data = await response.json();

   
      if (data && data.blogs) {
        setSearchResults(data.blogs);
      } else {
        setSearchResults([]); 
      }
      console.log(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };




  

  return (
    <div className="App">
      <h1>Blog Statistics</h1>
      <div>
        <label htmlFor="searchQuery">Search for Blogs:</label>
        <input
          type="text"
          id="searchQuery"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={()=>fetchBlogSearchResults(query)}>Search</button>
      </div>

      {searchResults.length > 0 ? (
        <div className="SearchResults">
          <h2>Search Results for "{query}"</h2>
          <ul>
            {searchResults.map((blog) => (
              <li key={blog.id}>{blog.title}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          {blogStats ? (
            <div>
              <h1>No Search</h1>
              <h2>All Details:-</h2>
              <p>Total number of blogs: {blogStats.totalBlogs}</p>
              <p>Longest blog title: {blogStats.longestBlog}</p>
              <p>Number of blogs with "privacy" in title: {blogStats.privacyBlogsCount}</p>
              <p>Unique blog titles: {blogStats.uniqueBlogTitles.map((data,index)=><li key={index}> {data}</li>)}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

