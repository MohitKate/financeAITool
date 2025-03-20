"use client"
import Lottie from 'lottie-react';

export default function FinanceAnim() {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Lottie
        animationData={require('./finance-animation.json')}
        loop={true}
      />
    </div>
  );
}