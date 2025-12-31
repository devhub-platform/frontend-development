import React from 'react'
import { useParams } from 'react-router-dom'
import { posts } from '../../context/PostsData'

export default function PostDetails() {
    const { id } = useParams();
    const post = posts.find(
    (p) => p.id === Number(id)
  );
    
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
<p>{post.author} • {post.date}</p>
<img src={post.image} alt="" />
<p>{post.excerpt}</p>
    </div>
  );
}
