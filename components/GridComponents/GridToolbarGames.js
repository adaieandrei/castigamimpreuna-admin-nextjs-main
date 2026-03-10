import { useMemo } from 'react';

export default function GridToolbar(props) {
    const stats = useMemo(() => {
        if (!props.meciuri || props.meciuri.length === 0) {
            return { won: 0, lost: 0, active: 0, total: 0, percent: 0 };
        }
        let won = 0, lost = 0, active = 0;
        props.meciuri.forEach((game) => {
            if (game.status === 'win') won++;
            else if (game.status === 'lost') lost++;
            else active++;
        });
        const settled = won + lost;
        const percent = settled > 0 ? Math.round((won / settled) * 100) : 0;
        return { won, lost, active, total: won + lost + active, percent };
    }, [props.meciuri]);

    return (
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-green-100 bg-white rounded-t-xl">
            <StatBadge label="Total" value={stats.total} color="bg-gray-600" />
            <StatBadge label="Câștigate" value={stats.won} color="bg-emerald-600" />
            <StatBadge label="Pierdute" value={stats.lost} color="bg-red-600" />
            <StatBadge label="Active" value={stats.active} color="bg-amber-500" />
            <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Rată câștig</span>
                <span className={`text-lg font-bold ${stats.percent >= 50 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stats.percent}%
                </span>
            </div>
        </div>
    );
}

function StatBadge({ label, value, color }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full text-white text-xs font-bold ${color}`}>
                {value}
            </span>
            <span className="text-sm text-gray-600">{label}</span>
        </div>
    );
}