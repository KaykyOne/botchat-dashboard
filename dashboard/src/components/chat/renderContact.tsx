import React from 'react'
import { Lead } from '../../models'
import { formatNumber } from '../../utils/formats'
import { format, subDays } from 'date-fns'

export default function RenderContact({ lead }: { lead: Lead }) {

    function getQualityStyle(qualidade: string | null | undefined) {
        if (!qualidade) return "bg-neutral-700"

        switch (qualidade.toLowerCase()) {
            case 'fria':
                return "bg-blue-600"
            case 'quente':
                return "bg-amber-500"
            case 'finalizada':
                return "bg-green-600"
            default:
                return "bg-neutral-700"
        }
    }

    function formatUpdateAt(date: Date) {
        const ontem = subDays(new Date(), 1);
        const anteontem = subDays(new Date(), 2);
        if(isNaN(date.getTime())) return "Data inválida";
        if(date > ontem) return format(date, 'HH:mm');
        if(date > anteontem) return format(date, 'dd/MM/yyyy HH:mm');
        return format(date, 'dd/MM/yyyy');
    }

    const updatedAt = formatUpdateAt(new Date(lead.updated_at));

    return (
        <div className="
            w-full 
            px-6 py-5 
            flex items-center gap-4 
            cursor-pointer 
            transition duration-200 
            hover:bg-neutral-800
            border-b border-neutral-700
        ">
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className={`w-12 h-12 ${getQualityStyle(lead.qualidade)} flex items-center justify-center text-white font-semibold text-sm rounded-lg`}>
                    {lead.numero?.slice(-2)}
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-white text-sm truncate">
                        {formatNumber(lead.numero)}
                    </p>
                    <span className="text-xs text-neutral-500 ml-2 flex-shrink-0">
                        {updatedAt}
                    </span>
                </div>

                <div className='flex flex-wrap gap-2 w-full'>
                    {lead.interesse ? (
                        <span className="text-xs bg-purple-700 text-neutral-200 px-2 py-1 rounded-md">
                            {lead.interesse}
                        </span>
                    ) : (
                        <span className="text-xs bg-neutral-700 text-neutral-400 px-2 py-1 rounded-md">
                            -
                        </span>
                    )}
                    {lead.ativo ? (
                        <span className="text-xs bg-green-700 text-neutral-200 px-2 py-1 rounded-md">
                            Ativo
                        </span>
                    ) : (
                        <span className="text-xs bg-neutral-700 text-neutral-400 px-2 py-1 rounded-md">
                            Inativo
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}