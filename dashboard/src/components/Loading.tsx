import React from 'react'

export default function Loading() {
    return (
        <div className="inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 absolute">
            <div className="flex gap-3">
                <div className="w-2 h-10 bg-blue-500 animate-pulse" />
                <div className="w-2 h-10 bg-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-10 bg-blue-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
        </div>
    )
}
