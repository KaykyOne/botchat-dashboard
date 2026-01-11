import React from 'react'

export default function InternalLoading() {
    return (
        <div className='flex absolute z-50 justify-center items-center w-full h-full bg-neutral-900 gap-1'>
            <div className='h-4 w-2 bg-amber-600 animate-bounce' />
            <div className='h-6 w-2 bg-amber-600 animate-bounce' />
            <div className='h-8 w-2 bg-amber-600 animate-bounce' />
        </div>
    )
}
