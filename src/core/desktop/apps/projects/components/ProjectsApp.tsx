"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { projects } from "../data/projects";

export function ProjectsApp() {
  return (
    <div className="flex h-full flex-col font-mono text-green-400">
      <h1 className="text-3xl font-bold">Projects</h1>

      <div className="mt-6 flex-1 overflow-y-auto space-y-6">
        {projects.map((project) => (
          <motion.div
            key={project.title}
            whileHover={{
              scale: 1.02,
              y: -3,
            }}
            transition={{
              duration: 0.2,
            }}
            className="rounded-lg border border-green-500/30 bg-black/30 p-5 shadow-lg"
          >
            {project.image && (
              <Image
                src={project.image}
                alt={project.title}
                width={1200}
                height={675}
                className="mb-4 h-52 w-full rounded-lg object-cover border border-green-500/20"
              />
            )}

            <h2 className="text-2xl font-bold text-green-300">
              {project.title}
            </h2>

            <p className="mt-2 text-green-300">{project.description}</p>

            <hr className="my-4 border-green-500/20" />

            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs tracking-wide"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-green-500 px-3 py-1 transition hover:bg-green-500 hover:text-black"
                >
                  GitHub
                </a>
              )}

              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-green-500 px-3 py-1 transition hover:bg-green-500 hover:text-black"
                >
                  Live Demo
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
