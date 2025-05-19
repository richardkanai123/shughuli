export function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border p-2 rounded-md shadow-sm">
                <p className="text-sm font-medium">{payload[0].name}</p>
                <p className="text-sm text-muted-foreground">{`${payload[0].value} tasks`}</p>
            </div>
        );
    }
    return null;
}