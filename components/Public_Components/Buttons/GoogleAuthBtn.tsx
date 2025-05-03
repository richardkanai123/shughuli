'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'

const GoogleAuthBtn = () => {
    return (
        <Button
            type="button"
            className="w-full h-12 bg-white/90  hover:bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 text-gray-700 font-semibold border border-gray-200 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer">
            <FcGoogle className="w-6 h-6" />
            Continue with Google
        </Button>
    )
}

export default GoogleAuthBtn