import React from 'react'
import Post from '../../Components/Post/Post'
import { PopularTags } from '../../Components/PopularTags/PopularTags'
import { RecommendedTopics } from '../../Components/RecommendedTopics/RecommendedTopics'
import { SuggestedToFollow } from '../../Components/SuggestedToFollow/SuggestedToFollow'

const Home = () => {
  return <>
  <div className='flex dark:bg-bg-primary-dark'>
    <div className='w-[23%] my-5 ml-3'> Message Box </div>
  <div className='flex flex-col justify-center items-center w-[50%] mx-5 dark:bg-bg-secondary-dark my-15 rounded-lg dark:shadow-2xl dark:shadow-gray-500/20 shadow-sm bg-white mb-2'>
    <Post/>
    <Post/>
    <Post/>
    <Post/>
    <Post/>
    <Post/>
  </div>
  <div className='w-[22%] my-10 mr-3'> 
    <RecommendedTopics/>
    <SuggestedToFollow/>
    <PopularTags/>
  </div>
  </div>
    </>
}

export default Home