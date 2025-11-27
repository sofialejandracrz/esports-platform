"use client";

import Link from "next/link";
import { IconTrophy } from "@tabler/icons-react";
import { RegisterForm } from "@/components/auth/register-form";
import dynamic from "next/dynamic";

const Particles = dynamic(() => import("@/components/Particles"), {
  ssr: false,
  loading: () => null,
});

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-background p-6 md:p-10">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Particles
          particleColors={["#8B5CF6", "#A855F7", "#06B6D4", "#EC4899"]}
          particleCount={120}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={120}
          moveParticlesOnHover={true}
          particleHoverFactor={0.5}
          alphaParticles={true}
          sizeRandomness={0.8}
          className="h-full w-full"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
            <IconTrophy className="size-6 text-white" />
          </div>
          <span className="text-xl font-bold">eSports Platform</span>
        </Link>
        <RegisterForm />
      </div>
    </div>
  );
}
