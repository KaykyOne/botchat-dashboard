import React from 'react'
import { Lead } from '../../models'
import { formatNumber } from '../../utils/formats'

export default function RenderContact({ lead }: { lead: Lead }) {

    function getQualityStyle(qualidade: string | null | undefined) {
        if (!qualidade) return "bg-neutral-600"

        switch (qualidade.toLowerCase()) {
            case 'fria':
                return "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
            case 'quente':
                return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
            case 'finalizada':
                return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
            default:
                return "bg-neutral-600"
        }
    }

    return (
        <div className="
            w-full 
            px-4 py-3 
            flex items-center gap-4 
            cursor-pointer 
            transition-all duration-200 
            hover:bg-neutral-800
            border-b border-neutral-800
        ">
            {/* Avatar */}
            <div className="relative">
                <div className={`w-12 h-12 rounded-md ${getQualityStyle(lead.qualidade)} flex items-center justify-center text-white font-semibold`}>
                    {lead.numero?.slice(-2)}
                </div>

                {/* status dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-neutral-900 rounded-md"></span>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <p className="font-medium text-white truncate">
                        {formatNumber(lead.numero)}
                    </p>
                    <span className="text-xs text-neutral-400">
                        12:45
                    </span>
                </div>

                <p className="text-sm text-neutral-400 truncate">
                    Última mensagem enviada...
                </p>
            </div>
        </div>
    )
}