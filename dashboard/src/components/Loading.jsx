import React from 'react'

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
                className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
            ></div>
        </div>
    )
}
