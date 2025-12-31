// src/data/posts.js
import img from "../assets/images/teamimage.png";
import img2 from "../assets/images/heroImage.jpg";
import img3 from "../assets/images/aboutImage.jpg";

export const posts = [
  {
    id: 0,
    title: "Building Scalable Microservices Architecture",
    excerpt:
      "Learn how to design and implement a production-ready microservices architecture using Node.js and Docker.",
    author: "John Doe",
    date: "Oct 8, 2025",
    readingTime: "6 min",
    image: img,
    tags: ["React", "JavaScript", "Web Development"],
    reactionsCount: 120,
    commentsCount: 45,
    views: 301,

  },
  {
    id: 1,
    title: "React Performance Optimization Techniques",
    excerpt:
      "Discover practical techniques to optimize React applications and improve performance.",
    author: "Jane Smith",
    date: "Nov 10, 2025",
    readingTime: "8 min",
    image: img2,
    tags: ["PHP", "Performance", "Frontend"],
    reactionsCount: 98,
    commentsCount: 32,
    views: 263,
  },
  {
    id: 2,
    title: "React Performance Optimization Techniques",
    excerpt:
      "Discover practical techniques to optimize React applications and improve performance.",
    author: "Jane Smith",
    date: "Sep 10, 2025",
    readingTime: "10 min",
    image: img3,
    tags: ["React", "Backend", "Frontend"],
    reactionsCount: 148,
    commentsCount: 61,
    views: 452,
  },
];
