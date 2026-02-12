'use client';

import Image from 'next/image';

import { motion } from 'motion/react';

type StepCardProps = {
    stepNumber: number;
    title: string;
    description: string;
    image: {
        src: string;
        alt: string;
    };
    index?: number;
};

const StepCard = ({ stepNumber, title, description, image, index = 0 }: StepCardProps) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="group relative flex flex-col items-center text-center">
            {/* Step Number */}
            <div className="shadow-raised-md bg-highlight text-on-highlight absolute -top-4 z-10 flex size-10 items-center justify-center rounded-full text-lg font-bold sm:size-12 sm:text-xl">
                {stepNumber}
            </div>

            {/* Image Container */}
            <div className="shadow-floating-md bg-secondary relative w-full overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl">
                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-text-primary mb-2 text-lg font-bold sm:text-xl">{title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
                </div>
            </div>

            {/* Connector Line (hidden on last item and mobile) */}
            <div className="bg-border absolute top-1/2 left-full hidden h-0.5 w-8 -translate-y-1/2 lg:block" />
        </motion.article>
    );
};

export default StepCard;
