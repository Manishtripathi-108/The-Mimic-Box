import React from 'react';

const DevOnly = () => {
    return (
        <div className="grid w-full">
            <div className="bg-primary w-full">
                <span className="text-text-primary">primary</span>
                <span className="text-text-secondary">secondary</span>
                <span className="text-accent">accent</span>
                <span className="text-highlight">highlight</span>
            </div>
            <div className="bg-secondary text-highlight w-full">
                <span className="text-text-primary">primary</span>
                <span className="text-text-secondary">secondary</span>
                <span className="text-accent">accent</span>
                <span className="text-highlight">highlight</span>
            </div>
            <div className="bg-tertiary text-text-primary w-full">
                <span className="text-text-primary">primary</span>
                <span className="text-text-secondary">secondary</span>
                <span className="text-accent">accent</span>
                <span className="text-highlight">highlight</span>
            </div>
            <div className="mx-auto flex w-fit gap-5">
                <div className="bg-primary shadow-floating-sm mx-auto mt-5 flex aspect-square w-64 items-center justify-center rounded-lg">
                    <span className="text-text-primary">primary</span>
                    <span className="text-text-secondary">secondary</span>
                    <span className="text-accent">accent</span>
                    <span className="text-highlight">highlight</span>
                </div>
                <div className="bg-secondary shadow-floating-sm mx-auto mt-5 flex aspect-square w-64 items-center justify-center rounded-lg">
                    <span className="text-text-primary">primary</span>
                    <span className="text-text-secondary">secondary</span>
                    <span className="text-accent">accent</span>
                    <span className="text-highlight">highlight</span>
                </div>
                <div className="bg-tertiary shadow-floating-sm mx-auto mt-5 flex aspect-square w-64 items-center justify-center rounded-lg">
                    <span className="text-text-primary">primary</span>
                    <span className="text-text-secondary">secondary</span>
                    <span className="text-accent">accent</span>
                    <span className="text-highlight">highlight</span>
                </div>
            </div>
        </div>
    );
};

export default DevOnly;
