'use client';
const ErrorState = ({ message }: { message: string }) => (
    <div className="p-6 text-center">
        <div className="text-destructive mb-2">Error Loading Projects</div>
        <p className="text-muted-foreground">{message}</p>

    </div>
);

export default ErrorState;