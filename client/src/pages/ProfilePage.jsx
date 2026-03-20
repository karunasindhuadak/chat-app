import React, { useState } from 'react'
import assets from '../assets/assets'
import {useNavigate} from 'react-router-dom'

const ProfilePage = () => {
  const navigate = useNavigate()
  const [selectedImg, setSelectedImg] = useState(null)
  const [name, setName] = useState("John Doe")
  const [bio, setBio] = useState("Hi, I'm John Doe.")

  const handleSubmit = async (event) => {
    event.preventDefault()
    navigate('/')
  }
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex justify-center items-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl border-2 border-gray-600 text-gray-300 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h2 className='text-lg'>Profile details</h2>
          <label htmlFor="avatar" className='flex items-center gap-2 cursor-pointer'>
            <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-15 h-15 ${selectedImg && 'rounded-full'}`}/>
            upload profile image
          </label>

          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Your name' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>

          <textarea onChange={(e) => setBio(e.target.value)} value={bio} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' required></textarea>

          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-lg text-lg cursor-pointer'>Save</button>
        </form>
        <img src={assets.logo_icon} alt="" className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10'/>
      </div>
    </div>
  )
}

export default ProfilePage
