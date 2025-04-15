'use client';

import React from 'react';

import CardContainer from '@/components/ui/CardContainer';
import ProgressBar from '@/components/ui/ProgressBar';
import { T_UploadState } from '@/lib/types/client.types';

export default function UploadProgressCard({ uploadState }: { uploadState: T_UploadState }) {
    if (!uploadState.total) return null;

    return (
        <CardContainer>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
                <span>{uploadState.formattedLoaded}</span>
                <span>{uploadState.formattedTotal}</span>
            </div>

            <ProgressBar percentage={uploadState.progress} className="h-3 rounded" />

            <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm">
                <div>
                    <span className="text-muted block text-xs uppercase">Progress</span>
                    <span className="text-foreground font-medium">{uploadState.formattedProgress}</span>
                </div>
                <div>
                    <span className="text-muted block text-xs uppercase">Rate</span>
                    <span className="text-foreground font-medium">{uploadState.formattedRate}</span>
                </div>
                <div>
                    <span className="text-muted block text-xs uppercase">Estimated</span>
                    <span className="text-foreground font-medium">{uploadState.formattedEstimated}</span>
                </div>
                <div>
                    <span className="text-muted block text-xs uppercase">Length Computable</span>
                    <span className="text-foreground font-medium">{uploadState.lengthComputable ? 'Yes' : 'No'}</span>
                </div>
            </div>
        </CardContainer>
    );
}
