'use client';

import React, { useState } from 'react';
import Rain from './rain';
import Timer from './timer';

import { motion, AnimatePresence } from 'framer-motion';

const Pomodoro = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isPlaying ? 1 : 0 }}
            exit={{ opacity: 0, transition: { duration: 1 } }} // Exit animation
            transition={{ duration: 1 }} // Adjust duration as needed
          >
            <Rain />
          </motion.div>
        )}
      </AnimatePresence>
      <Timer isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
    </>
  );
};

export default Pomodoro;
