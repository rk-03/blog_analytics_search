const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const _ = require('lodash');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

let blogs = []; 

app.use(cors());
app.use(bodyParser.json());


async function fetchBlogsData() {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });
    blogs = response.data.blogs;

    console.log('Blogs data fetched successfully.');
  } catch (error) {
    console.error('Error fetching blogs data:', error);
  }
}

fetchBlogsData().then(() => {

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});





app.get('/', async (req, res) => {
  if (blogs.length > 0) {

    const longestTitleBlog = _.maxBy(blogs, (blog) => blog.title.length);
    const longestBlog = longestTitleBlog.title


    const privacyBlogsCount = _.filter(blogs, (blog) =>
      blog.title.toLowerCase().includes('privacy')
    ).length;


    const uniqueBlogTitles = _.uniqBy(blogs, 'title').map((blog) => blog.title);

    res.json({
      totalBlogs: blogs.length,
      longestBlog,
      privacyBlogsCount,
      uniqueBlogTitles,
    });

  } else {
    res.status(500).json({ error: 'Blogs data is not available' });
  }
});






app.get('/api/blog-stats', async (req, res) => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', { 
        headers:{
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        }
     });

     //console.log(response)
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});





app.get('/api/blog-search', (req, res) => {
  const query = req.query.query;
  if (!query) {
    res.status(400).json({ error: 'Query parameter is required' });
    return;
  }

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(query.toLowerCase())
  );

  res.json({ blogs: filteredBlogs });
});







