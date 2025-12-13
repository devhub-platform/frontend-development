import React from 'react'
import Post from '../../Components/Post/Post'

const Home = () => {
  return <>
  <div className='flex dark:bg-bg-primary-dark'>
    <div className='w-[24%] my-5'> Message Box </div>
  <div className='flex flex-col justify-center items-center w-[50%] mx-auto dark:bg-bg-secondary-dark my-5 rounded-lg dark:shadow-2xl dark:shadow-gray-500/20'>
    <Post/>
    <Post/>
    <Post/>
    <Post/>
    <Post/>
    <Post/>
  </div>
  <div className='w-[24%] my-5'> Popular Tags, Recommeded Topics, Suggest to Follow</div>
  </div>
    </>
}

export default Home