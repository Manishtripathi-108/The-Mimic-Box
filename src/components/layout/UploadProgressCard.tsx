'use client';

import CardContainer from '@/components/ui/CardContainer';
import ProgressBar from '@/components/ui/ProgressBar';
import { T_UploadState } from '@/lib/types/client.types';

export default function UploadProgressCard({ uploadState, onCancel }: { uploadState: T_UploadState; onCancel?: () => void }) {
    return (
        <CardContainer className="w-full max-w-md">
            <div className="text-muted-foreground flex items-center justify-between text-sm">
                <span>{uploadState.formattedLoaded}</span>
                <span>{uploadState.formattedTotal}</span>
            </div>

            <ProgressBar percentage={uploadState.progress} className="my-2 h-5 p-0.5" />

            <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm">
                <div>
                    <span className="text-muted block text-xs">Progress</span>
                    <span className="text-foreground font-medium">{uploadState.formattedProgress}</span>
                </div>
                <div>
                    <span className="text-muted block text-xs">Rate</span>
                    <span className="text-foreground font-medium">{uploadState.formattedRate}</span>
                </div>
                <div>
                    <span className="text-muted block text-xs">Estimated Time</span>
                    <span className="text-foreground font-medium">{uploadState.formattedEstimated}</span>
                </div>
            </div>

            {onCancel && (
                <button type="button" className="button button-danger" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </CardContainer>
    );
}
