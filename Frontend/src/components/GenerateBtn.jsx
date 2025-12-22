import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import {motion} from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const GenerateBtn = () => {
const {user, setShowLogin} = useContext(AppContext)
const navigate = useNavigate()
const onClickHandler=()=>{

  if(user){
navigate('/result')
  }else{
    setShowLogin(true)
  }
}

  return (
    <motion.div
     initial={{opacity:0.2, y: 100}}
     transition={{duration:1}}
     whileInView={{opacity:1 , y:0}}
     viewport={{once:true}}
     className='pb-20 text-center'
    >

      <h1
        className="text-3xl md:text-5xl font-extrabold 
        mt-6 mb-10 tracking-tight 
        text-gray-900 dark:text-white"
      >
        See the magic.{" "}
        <span className="text-orange-500 drop-shadow-sm">
          Try Now ✨
        </span>
      </h1>

      <button
        onClick={onClickHandler}
        className="inline-flex items-center gap-2 px-14 py-3 
        rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 
        text-black font-semibold shadow-lg
        hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        Generate Images
        <img src={assets.star_group} alt="" className="h-6" />
      </button>

    </motion.div>
  )
}

export default GenerateBtn
