'use client';

import Link from 'next/link';

import { motion } from 'motion/react';

import { Button } from '@/components/ui/Button';
import Waves from '@/components/ui/Waves';
import APP_ROUTES from '@/constants/routes/app.routes';

const CTASection = () => {
    return (
        <section className="bg-secondary relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="bg-highlight/5 animate-blob absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl" />
                <div
                    className="bg-accent/5 animate-blob absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full blur-3xl"
                    style={{ animationDelay: '3s' }}
                />
            </div>

            <div className="mx-auto max-w-4xl text-center">
                {/* Animated icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', duration: 0.8 }}
                    className="mb-8 flex justify-center">
                    <Waves className="max-w-24">
                        <span className="shadow-raised-md bg-highlight text-on-highlight absolute inset-2 flex items-center justify-center rounded-full text-3xl">
                            🚀
                        </span>
                    </Waves>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}>
                    <h2 className="text-text-primary font-alegreya text-3xl font-bold sm:text-4xl lg:text-5xl">
                        Ready to Transform Your
                        <span className="text-highlight block">Entertainment Experience?</span>
                    </h2>

                    <p className="text-text-secondary mx-auto mt-6 max-w-2xl text-lg">
                        Join thousands of users who have already made Mimic Box their go-to platform for music, anime, gaming, and more.
                    </p>

                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                        <Button asChild variant="highlight" size="2xl">
                            <Link href={APP_ROUTES.AUTH.REGISTER}>Create Free Account</Link>
                        </Button>
                        <Button asChild variant="outline" size="2xl">
                            <Link href={APP_ROUTES.AUTH.LOGIN}>Sign In</Link>
                        </Button>
                    </div>

                    <p className="text-text-secondary mt-6 text-sm">No credit card required · Free forever · Open source</p>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
