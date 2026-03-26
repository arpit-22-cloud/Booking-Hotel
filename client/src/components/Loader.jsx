import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import{useAppContext} from '../context/AppContext'

const Loader = () => {
  const { nextURL } = useParams()
  const {navigate} = useAppContext()

  useEffect(() => {
    if (nextURL) {
      setTimeout(() => {
        navigate(`/${nextURL}`)
      }, 8000)
    }
  }, [nextURL])

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="h-16 w-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-medium">Processing your payment...</p>
    </div>
  )
}

export default Loader