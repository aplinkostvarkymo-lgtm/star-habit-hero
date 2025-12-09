import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface CelebrationAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  levelUp?: boolean;
  newLevel?: number;
}

export const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  isOpen,
  onClose,
  levelUp = false,
  newLevel,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-hero-primary mb-4">
          {levelUp ? 'Level Up!' : 'Mission Complete!'}
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          {levelUp
            ? `Amazing! You've reached Level ${newLevel}!`
            : "Great job! You've completed all your missions today!"}
        </p>
        <Button variant="success" size="lg" onClick={onClose} fullWidth>
          Awesome! 🌟
        </Button>
      </div>
    </Modal>
  );
};

