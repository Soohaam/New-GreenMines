import React from 'react';

const reviews = [
  { name: "Jack", username: "@jack", body: "I've never seen anything like this before. It's amazing. I love it.", img: "https://avatar.vercel.sh/jack" },
  { name: "Jill", username: "@jill", body: "I don't know what to say. I'm speechless. This is amazing.", img: "https://avatar.vercel.sh/jill" },
  { name: "John", username: "@john", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/john" },
  { name: "Jane", username: "@jane", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/jane" },
  { name: "Jenny", username: "@jenny", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/jenny" },
  { name: "James", username: "@james", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/james" },
];

export function MarqueeReviews() {
  const ReviewCard = ({ img, name, username, body }) => (
    <figure className="relative w-64 h-50 mx-2 cursor-pointer overflow-hidden rounded-xl border p-4 
      border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]
      dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]">
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-white">{body}</blockquote>
    </figure>
  );

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-[#342F49]">
      <div className="absolute top-1/4 flex w-full overflow-hidden">
        <div className="flex animate-marquee">
          {[...reviews, ...reviews].map((review, index) => (
            <ReviewCard key={`top-${index}`} {...review} />
          ))}
        </div>
        <div className="flex animate-marquee">
          {[...reviews, ...reviews].map((review, index) => (
            <ReviewCard key={`top-duplicate-${index}`} {...review} />
          ))}
        </div>
      </div>

     
      
      <div className="absolute top-1/2 flex w-full overflow-hidden mt-5">
        <div className="flex animate-marquee-reverse">
          {[...reviews.reverse(), ...reviews.reverse()].map((review, index) => (
            <ReviewCard key={`bottom-${index}`} {...review} />
          ))}
        </div>
        <div className="flex animate-marquee-reverse">
          {[...reviews.reverse(), ...reviews.reverse()].map((review, index) => (
            <ReviewCard key={`bottom-duplicate-${index}`} {...review} />
          ))}
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-[#342F49]"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-[#342F49]"></div>
    </div>
  );
}