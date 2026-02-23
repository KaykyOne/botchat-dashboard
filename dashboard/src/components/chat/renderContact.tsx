import React from 'react'
import { Lead } from '../../models'
import { formatNumber } from '../../utils/formats'
import { format, subDays } from 'date-fns'

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
                        {updatedAt}
                    </span>
                </div>

                <p className="text-sm text-neutral-400 truncate">
                    Clique para ver detalhes do contato
                </p>
                <div className='flex flex-wrap gap-2 w-full mt-2'>
                    {lead.interesse ? (
                        <span className="text-xs bg-primary text-neutral-300 px-2 py-0.5 rounded-md">
                            {lead.interesse}
                        </span>
                    ) : (
                        <span className="text-xs bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded-md">
                            Sem interesse definido
                        </span>
                    )}
                    {lead.ativo ? (
                        <span className="text-xs bg-green-700 text-neutral-300 px-2 py-0.5 rounded-md">
                            Ativo
                        </span>
                    ) : (
                        <span className="text-xs bg-gray-700 text-neutral-300 px-2 py-0.5 rounded-md">
                            Inativo
                        </span>
                    )

                    }
                </div>
            </div>
        </div>
    )
}