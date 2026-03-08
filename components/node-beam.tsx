"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import {
  IconBrain,
  IconApi,
  IconDatabase,
  IconMessageCircle,
  IconWorldWww,
  IconClock,
  IconTopologyRing3,
  IconBuildingSkyscraper,
  IconBell,
  IconBroadcast,
} from "@tabler/icons-react";

const Node = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label?: string }
>(({ className, children, label }, ref) => {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-background p-2.5 shadow-md",
          className
        )}
      >
        {children}
      </div>
      {label && (
        <span className="text-[10px] font-medium text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
});
Node.displayName = "Node";

export function NodeBeamVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const masterRef = useRef<HTMLDivElement>(null);
  const llmRef = useRef<HTMLDivElement>(null);
  const httpRef = useRef<HTMLDivElement>(null);
  const sqliteRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const webRef = useRef<HTMLDivElement>(null);
  const cronRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-87.5 w-full items-center justify-center overflow-hidden rounded-xl border bg-background/50 py-0 px-10"
    >
      <div className="flex size-full max-h-70 max-w-lg flex-col items-stretch justify-between gap-10">
        {/* Top row */}
        <div className="flex flex-row items-center justify-between">
          <Node ref={llmRef} label="LLM">
            <IconBrain className="size-5 text-purple-500" />
          </Node>
          <Node ref={webRef} label="Web Scraper">
            <IconWorldWww className="size-5 text-green-500" />
          </Node>
        </div>

        {/* Middle row */}
        <div className="flex flex-row items-center justify-between">
          <Node ref={httpRef} label="HTTP">
            <IconApi className="size-5 text-blue-500" />
          </Node>
          <Node
            ref={masterRef}
            className="size-16 border-primary bg-background"
            label="Organization"
          >
            <IconTopologyRing3 className="size-7 text-primary" />
          </Node>
          <Node ref={cronRef} label="Scheduler">
            <IconClock className="size-5 text-orange-500" />
          </Node>
        </div>

        {/* Bottom row */}
        <div className="flex flex-row items-center justify-between">
          <Node ref={sqliteRef} label="SQLite">
            <IconDatabase className="size-5 text-amber-500" />
          </Node>
          <Node ref={msgRef} label="Msg Relay">
            <IconMessageCircle className="size-5 text-rose-500" />
          </Node>
        </div>
      </div>

      {/* Beams from left nodes → master */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={llmRef}
        toRef={masterRef}
        curvature={-75}
        endYOffset={-10}
        gradientStartColor="#a855f7"
        gradientStopColor="#6366f1"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={httpRef}
        toRef={masterRef}
        gradientStartColor="#3b82f6"
        gradientStopColor="#6366f1"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={sqliteRef}
        toRef={masterRef}
        curvature={75}
        endYOffset={10}
        gradientStartColor="#f59e0b"
        gradientStopColor="#6366f1"
      />

      {/* Beams from master → right nodes (reverse) */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={webRef}
        toRef={masterRef}
        curvature={-75}
        endYOffset={-10}
        reverse
        gradientStartColor="#22c55e"
        gradientStopColor="#6366f1"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={cronRef}
        toRef={masterRef}
        reverse
        gradientStartColor="#f97316"
        gradientStopColor="#6366f1"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={msgRef}
        toRef={masterRef}
        curvature={75}
        endYOffset={10}
        reverse
        gradientStartColor="#f43f5e"
        gradientStopColor="#6366f1"
      />
    </div>
  );
}

export function CrossOrgBeamVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Org A refs
  const orgAMasterRef = useRef<HTMLDivElement>(null);
  const orgANode1Ref = useRef<HTMLDivElement>(null);
  const orgANode2Ref = useRef<HTMLDivElement>(null);
  const orgANode3Ref = useRef<HTMLDivElement>(null);

  // Org B refs
  const orgBMasterRef = useRef<HTMLDivElement>(null);
  const orgBNode1Ref = useRef<HTMLDivElement>(null);
  const orgBNode2Ref = useRef<HTMLDivElement>(null);
  const orgBNode3Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border bg-background/50 px-6 py-8"
    >
      <div className="flex size-full max-w-3xl items-center justify-between gap-6">
        {/* Org A cluster */}
        <div className="flex flex-col items-center gap-5">
          <Node ref={orgANode1Ref}>
            <IconBrain className="size-5 text-indigo-500" />
          </Node>
          <Node ref={orgANode2Ref}>
            <IconApi className="size-5 text-cyan-500" />
          </Node>
          <Node ref={orgANode3Ref}>
            <IconDatabase className="size-5 text-amber-500" />
          </Node>
        </div>

        {/* Org A Master */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            ref={orgAMasterRef}
            className="z-10 flex size-16 items-center justify-center rounded-full border-2 border-primary bg-background p-2.5 shadow-md"
          >
            <IconTopologyRing3 className="size-7 text-primary" />
          </div>
          <span className="text-xs font-semibold text-primary">Org A</span>
        </div>

        {/* Spacer for the cross-org beams */}
        <div className="flex-1" />

        {/* Org B Master */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            ref={orgBMasterRef}
            className="z-10 flex size-16 items-center justify-center rounded-full border-2 border-cyan-500 bg-background p-2.5 shadow-md"
          >
            <IconBuildingSkyscraper className="size-7 text-cyan-500" />
          </div>
          <span className="text-xs font-semibold text-cyan-500">Org B</span>
        </div>

        {/* Org B cluster */}
        <div className="flex flex-col items-center gap-5">
          <Node ref={orgBNode1Ref}>
            <IconWorldWww className="size-5 text-green-500" />
          </Node>
          <Node ref={orgBNode2Ref}>
            <IconMessageCircle className="size-5 text-rose-500" />
          </Node>
          <Node ref={orgBNode3Ref}>
            <IconClock className="size-5 text-orange-500" />
          </Node>
        </div>
      </div>

      {/* Org A nodes → Org A Master */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={orgANode1Ref}
        toRef={orgAMasterRef}
        curvature={-40}
        endYOffset={-5}
        gradientStartColor="#a855f7"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={orgANode2Ref}
        toRef={orgAMasterRef}
        gradientStartColor="#3b82f6"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={orgANode3Ref}
        toRef={orgAMasterRef}
        curvature={40}
        endYOffset={5}
        gradientStartColor="#f59e0b"
        gradientStopColor="#3b82f6"
      />

      {/* Cross-org: Master A ↔ Master B (bidirectional) */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={orgAMasterRef}
        toRef={orgBMasterRef}
        startYOffset={10}
        endYOffset={10}
        curvature={-20}
        gradientStartColor="#3b82f6"
        gradientStopColor="#10b981"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={orgAMasterRef}
        toRef={orgBMasterRef}
        startYOffset={-10}
        endYOffset={-10}
        curvature={20}
        reverse
        gradientStartColor="#10b981"
        gradientStopColor="#3b82f6"
      />

      {/* Org B Master → Org B nodes (reverse) */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={orgBNode1Ref}
        toRef={orgBMasterRef}
        curvature={-40}
        endYOffset={-5}
        reverse
        gradientStartColor="#22c55e"
        gradientStopColor="#10b981"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={orgBNode2Ref}
        toRef={orgBMasterRef}
        reverse
        gradientStartColor="#f43f5e"
        gradientStopColor="#10b981"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={orgBNode3Ref}
        toRef={orgBMasterRef}
        curvature={40}
        endYOffset={5}
        reverse
        gradientStartColor="#f97316"
        gradientStopColor="#10b981"
      />
    </div>
  );
}

export function SubscriberFirstBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subscriberRef = useRef<HTMLDivElement>(null);
  const topicRef = useRef<HTMLDivElement>(null);
  const pub1Ref = useRef<HTMLDivElement>(null);
  const pub2Ref = useRef<HTMLDivElement>(null);
  const pub3Ref = useRef<HTMLDivElement>(null);
  const pub4Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-center overflow-hidden rounded-xl border bg-background/50 px-10 py-21"
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        {/* Subscriber (left) */}
        <div className="flex flex-col justify-center">
          <Node ref={subscriberRef} className="size-14 border-emerald-500 bg-emerald-500/10" label="Subscriber">
            <IconBell className="size-6 text-emerald-500" />
          </Node>
        </div>

        {/* Topic (center) */}
        <div className="flex flex-col justify-center">
          <Node ref={topicRef} className="size-16 border-primary bg-background" label="Org">
            <IconTopologyRing3 className="size-7 text-primary" />
            {/* <IconBroadcast className="size-7 text-primary" />  */}
          </Node>
        </div>

        {/* Publishers (right column) */}
        <div className="flex flex-col justify-center gap-3">
          <Node ref={pub1Ref} label="Node A">
            <IconBrain className="size-5 text-purple-500" />
          </Node>
          <Node ref={pub2Ref} label="Node B">
            <IconApi className="size-5 text-blue-500" />
          </Node>
          <Node ref={pub3Ref} label="Node C">
            <IconDatabase className="size-5 text-amber-500" />
          </Node>
          <Node ref={pub4Ref} label="Node D">
            <IconWorldWww className="size-5 text-green-500" />
          </Node>
        </div>
      </div>

      {/* Publishers → Topic */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={pub1Ref}
        toRef={topicRef}
        duration={3}
        gradientStartColor="#a855f7"
        gradientStopColor="#6366f1"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={pub2Ref}
        toRef={topicRef}
        duration={3}
        gradientStartColor="#3b82f6"
        gradientStopColor="#6366f1"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={pub3Ref}
        toRef={topicRef}
        duration={3}
        gradientStartColor="#f59e0b"
        gradientStopColor="#6366f1"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={pub4Ref}
        toRef={topicRef}
        duration={3}
        gradientStartColor="#22c55e"
        gradientStopColor="#6366f1"
      />

      {/* Topic → Subscriber */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={topicRef}
        toRef={subscriberRef}
        duration={3}
        gradientStartColor="#6366f1"
        gradientStopColor="#10b981"
      />
    </div>
  );
}
