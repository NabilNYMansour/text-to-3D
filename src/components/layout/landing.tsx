"use client";

import { Suspense, useLayoutEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TextTo3D } from "./main-app";
import { ActionResponseType, ControlsType, defaultControls } from "@/lib/constants-and-types";
import { useElementSize, useScrollIntoView } from "@mantine/hooks";
import Loader from "../elements/loader";
import { Label } from "../ui/label";
import Pricing from "./pricing";
import { cn, encodeJson } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { ArrowBigRight, CirclePlus, Download, FileType, Wrench } from "lucide-react";
import Link from "next/link";
import MyProjects from "./my-projects";
import { Skeleton } from "../ui/skeleton";
import { useSidebar } from "../ui/sidebar";
import { defaultTemplate, gradientTemplate, perspectiveTemplate } from "@/lib/project-templates";

const DescriptionCard = ({ title, description, icon }: {
  title: string,
  description: string,
  icon: React.ReactNode
}) => {
  return <div className={cn("p-4 bg-background border-2 border-muted rounded-md shadow-md flex flex-col items-center cursor-default group",
    "transition-all duration-300 ease-out",
    "hover:translate-y-[-4px] hover:bg-primary hover:border-black"
  )}>
    <div className="cu-flex-center gap-2 group-hover:text-black">
      {icon}
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <Separator className="w-20 h-0.5 bg-foreground my-2 group-hover:bg-black" />
    <p className="text-muted-foreground group-hover:text-black">{description}</p>
  </div>
}

export const LandingNoUser = () => {
  const [text, setText] = useState<string>("Text to 3D");
  const [controls, setControls] = useState<ControlsType>(defaultControls);
  const { ref, width } = useElementSize();
  const featuresScroll = useScrollIntoView<HTMLDivElement>();
  const pricingScroll = useScrollIntoView<HTMLDivElement>();

  const zoom = useMemo(() => {
    if (width < 500) return 0.3;
    if (width < 700) return 0.5;
    if (width < 1000) return 0.75;
    return 1;
  }, [width]);

  useLayoutEffect(() => {
    setControls((prev) => ({ ...prev, text }));
  }, [text]);

  useLayoutEffect(() => {
    setControls((prev) => ({
      ...prev,
      curveSegments: {
        ...prev.curveSegments,
        value: 32
      },
      bevelThickness: {
        ...prev.bevelThickness,
        value: 0.35
      },
    }));
  }, []);

  return <div className="flex flex-col items-center w-full h-full">
    {/* //=========={ Grid Background }==========// */}
    <div className="pointer-events-none fixed inset-0 z-[0] bg-[linear-gradient(to_right,#6b7280_1px,transparent_1px),linear-gradient(to_bottom,#6b7280_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

    {/* //=========={ Navigation }==========// */}
    <nav className="flex items-center justify-between w-full max-w-6xl z-[1] px-2">
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => featuresScroll.scrollIntoView({ alignment: "center" })}>Features</Button>
        <Button variant="secondary" onClick={() => pricingScroll.scrollIntoView({ alignment: "center" })}>Pricing</Button>
      </div>
      <div className="flex gap-2">
        <Link href="/sign-in" passHref>
          <Button variant="secondary">Login</Button>
        </Link>
        <Link href="/sign-up" passHref>
          <Button>Sign Up</Button>
        </Link>
      </div>
    </nav>

    <div className="px-4 w-full bg-gradient-to-t from-[#e03f3b] overflow-visible z-[1]">
      {/* //=========={ Hero }==========// */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-5xl mt-16 font-semibold text-center">Turn Your Text into 3D</h1>
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-lg md:text-xl text-center mb-4">
            Transform your <span className="text-2xl text-[#e03f3b]">text</span> into
            stunning <span className="text-2xl text-[#e03f3b]">3D</span> models with an easy-to-use tool.
          </p>
          <Link href="/project" passHref className="w-full max-w-2xl">
            <Button
              variant="outline"
              className={cn("w-full h-12 text-lg border-0 font-semibold shadow-[inset_0_0_10px_5px] shadow-muted group",
                "transition-all duration-300 ease-out",
                "hover:translate-y-[-4px] hover:shadow-none hover:scale-105 hover:bg-primary hover:text-black"
              )}
            >
              Get Started for Free <ArrowBigRight className={cn(
                "!w-8 !h-8 group-hover:translate-x-0 -translate-x-1",
                "transition-all duration-200 ease-out"
              )} />
            </Button>
          </Link>
        </div>

        {/* <div className="cu-flex-center gap-2">
          <Separator className="w-32 h-0.5 bg-foreground" />
          <Button size="icon" variant="ghost">
            <XTwitter />
          </Button>
          <Separator className="w-32 h-0.5 bg-foreground" />
        </div> */}

        <div className="relative flex justify-between items-center w-full max-w-xl gap-2">
          <Label htmlFor="Try out" className="min-w-fit animate-point-right">Try it out <span>👉</span></Label>
          <Input
            defaultValue={text}
            type="text" placeholder="Enter your text here"
            className="w-full md:w-96 bg-background text-foreground shadow-[inset_0_0_10px_2px] shadow-muted"
            onChange={(e) => setText(e.target.value)}
          />
          <Label htmlFor="Try out" className="min-w-fit opacity-0">Try it out 👉</Label>
        </div>
      </div>

      {/* //=========={ Scene }==========// */}
      <div className="h-[300px] md:h-[650px]" ref={ref}
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1), rgba(0,0,0,1), rgba(0,0,0,0))',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1), rgba(0,0,0,1), rgba(0,0,0,0)),',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <div className="h-full w-full"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1), rgba(0,0,0,1), rgba(0,0,0,0))',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1), rgba(0,0,0,1), rgba(0,0,0,0)),',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        >
          <Suspense fallback={
            <div className="cu-flex-center h-full w-full">
              <Loader tailwind="text-primary" />
            </div>
          }>
            <TextTo3D
              key={zoom}
              controls={controls}
              frameloop="always"
              orbitControlsEnabled
              clickScreenShot={false}
              geometryRerenderKey={text}
              zoom={zoom}
              className="w-full h-full pointer-events-none bg-transparent"
              enableZoom={false}
              enablePan={false}
              autoRotate
            />
          </Suspense>
        </div>
      </div>
    </div>

    {/* //=========={ Features }==========// */}
    <div className="bg-[#e03f3b] text-center z-[1] w-full cu-flex-center flex-col gap-4 py-10 border-b-4 border-primary rounded-b-md" ref={featuresScroll.targetRef}>
      <h2 className="text-3xl font-semibold text-center text-white">Made for Designers, Developers, and Creators</h2>
      <p className="text-lg text-white max-w-2xl mt-4">Our tool is perfect for creating 3D models for presentations, marketing materials, games, and more.</p>
      <div className="px-10 w-full cu-flex-center">
        <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl">
          <DescriptionCard
            title="Easy to Use"
            description="Our tool is designed to be user-friendly and intuitive, so you can create stunning 3D models with ease."
            icon={<Wrench />}
          />
          <DescriptionCard
            title="High Quality"
            description="Generate high-quality 3D models and export them in various formats to use in your projects."
            icon={<Download />}
          />
          <DescriptionCard
            title="Custom Fonts"
            description="Upload and use your own custom fonts to create unique and personalized 3D models."
            icon={<FileType />}
          />
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-t from-background z-[1] w-full flex flex-col items-center" ref={pricingScroll.targetRef}>
      {/* //=========={ Pricing }==========// */}
      <Pricing />

      {/* //=========={ Footer }==========// */}
      <Separator className="w-[75%] h-px mt-36 mb-2" />
      <footer className="p-4 flex">
        <p className="text-center text-xs text-muted-foreground">© 2024 TextTo3D</p>
        <Separator orientation="vertical" className="h-4 mx-4" />
        <p className="text-center text-xs text-muted-foreground">Developed by{" "}
          <a href="https://nabilmansour.com/" target="_blank"
            rel="noopener noreferrer"
            className="text-primary 
            hover:underline">
            Nabil Mansour
          </a>
        </p>
      </footer>
    </div>
  </div>
};

const TemplateCard = ({ controls }: { controls: ControlsType }) => {
  const sidebar = useSidebar();
  return <Link href={"/project?controls=" + encodeJson(controls)} passHref
    className={cn("rounded-md max-w-full w-[325px] h-[210px] overflow-hidden border border-muted",
      "transition-all duration-300 ease-out",
      "hover:translate-y-[-4px] hover:bg-primary hover:border-primary")}
    onClick={() => sidebar.setOpen(false)}
  >
    <div className="absolute z-[1] m-1 p-1 bg-primary rounded-md text-primary-foreground">
      <CirclePlus />
    </div>
    <Suspense fallback={<Skeleton className="w-full h-full bg-muted" />}>
      <TextTo3D
        controls={controls}
        frameloop="demand"
        orbitControlsEnabled={false}
        clickScreenShot={false}
        geometryRerenderKey={"default"}
        zoom={0.25}
        className="w-full h-full pointer-events-none bg-transparent rounded-none"
      />
    </Suspense>
  </Link>
}

export const LandingUser = ({ userName, latestProjects, DeleteProject, UpdateName }: {
  userName: string | null,
  latestProjects: { slug: string, name: string, payload: ControlsType }[],
  DeleteProject: (clerkId: string, slug: string) => Promise<ActionResponseType>
  UpdateName: (clerkId: string, slug: string, name: string) => Promise<ActionResponseType>
}) => {
  return <div className="flex flex-col items-center w-full h-full">
    <h1 className="text-4xl font-bold text-center mt-8 mb-4">Welcome {userName}</h1>
    {latestProjects.length > 0 && <MyProjects
      latestProjects={latestProjects}
      projects={[]}
      deleteProject={DeleteProject}
      updateProjectName={UpdateName}
      projectsCount={0}
      currentPage={0}
      pageSize={1}
      showAllProjects={false}
    />}

    <div className="flex items-center justify-center mt-8 mb-4 gap-2">
      <CirclePlus />
      <h2 className="text-2xl font-semibold text-center select-none"> Start a new project</h2>
    </div>
    <p className="text-lg text-center max-w-2xl select-none">Choose a template to start creating your 3D model.</p>
    <div className="w-full flex flex-wrap justify-center items-center gap-2 p-4">
      <TemplateCard controls={defaultTemplate} />
      <TemplateCard controls={gradientTemplate} />
      <TemplateCard controls={perspectiveTemplate} />
    </div>
  </div>
}
