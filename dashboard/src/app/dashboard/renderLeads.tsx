import { Lead } from "../../models"
import { format } from "date-fns"

export default function RenderLeads({ leads }: { leads: Lead[] }) {
    const hoje = new Date()

    const leadsHoje = leads.filter(
        l => format(new Date(l.created_at), "dd/MM/yyyy") === format(hoje, "dd/MM/yyyy")
    )

    const leadsEsseMes = leads.filter(
        l => format(new Date(l.created_at), "MM/yyyy") === format(hoje, "MM/yyyy")
    )

    const Card = ({
        titulo,
        total,
        lista
    }: {
        titulo: string
        total: number
        lista: Lead[]
    }) => (
        <div className="border border-neutral-700 bg-neutral-900 p-8 z-10 max-h-[350px] rounded-lg">
            {/* Header */}
            <div className="flex items-baseline justify-between mb-6">
                <div>
                    <h2 className="text-xs uppercase tracking-widest text-neutral-500">
                        {titulo}
                    </h2>
                    <p className="text-3xl font-semibold text-neutral-100 mt-2">
                        {total}
                    </p>
                </div>
            </div>

            {/* Lista */}
            <div className="flex flex-col divide-y divide-neutral-700 max-h-[260px] overflow-y-auto">
                {lista.length > 0 ? (
                    lista.map((l, index) => (
                        <div
                            key={l.id}
                            className="flex items-center justify-between py-3 text-sm"
                        >
                            <div className="flex gap-2 justify-center items-center w-fit">
                                <p className="text-neutral-500">
                                    {index + 1}.
                                </p>
                                <span className="text-neutral-200">
                                    {l.numero}
                                </span>
                            </div>

                            <span className="text-neutral-500 font-mono text-xs">
                                {`Dia ${format(new Date(l.created_at), "dd - HH:mm")}`}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center text-sm text-neutral-500">
                        Nenhum lead criado ainda
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Card
                titulo="Leads de Hoje"
                total={leadsHoje.length}
                lista={leadsHoje}
            />

            <Card
                titulo={`Leads deste Mês (${format(hoje, "MM/yyyy")})`}
                total={leadsEsseMes.length}
                lista={leadsEsseMes}
            />
        </div>
    )
}