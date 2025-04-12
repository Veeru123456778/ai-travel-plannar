"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TravelCard({ name, image, desc, delay = 0 }) {
  return (
    <motion.div
      className="card w-full bg-base-100 shadow-xl"
      // Animate on scroll into view
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <figure>
        <Image
          src={image}
          alt={name}
          width={300}
          height={200}
          className="w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{desc}</p>
      </div>
    </motion.div>
  );
}
