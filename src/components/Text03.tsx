import React from 'react';
import { motion } from 'motion/react';

interface AnimatedTextProps {
    text?: string;
    className?: string;
}

export function Text_03({
    text = 'Hover me',
    className = '',
}: AnimatedTextProps) {
    return (
        <motion.span
            className={['w-full text-center inline-block cursor-pointer text-3xl transition-all', className].filter(Boolean).join(' ')}
            whileHover="hover"
            initial="initial"
        >
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    variants={{
                        initial: { y: 0, scale: 1 },
                        hover: {
                            y: -4,
                            scale: 1.2,
                            transition: {
                                type: 'spring',
                                stiffness: 300,
                                damping: 15,
                                delay: index * 0.03,
                            },
                        },
                    }}
                >
                    {char === '\n' ? <br /> : char}
                </motion.span>
            ))}
        </motion.span>
    );
}

