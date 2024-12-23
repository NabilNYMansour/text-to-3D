"use client";

import { Suspense, useEffect, useMemo, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { TextTo3D } from './main-app';
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CirclePlus, Ellipsis, ExternalLink, Pencil, SendHorizontal, Trash2 } from 'lucide-react';
import { ActionResponseType, ControlsType } from '@/lib/constants-and-types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import Loader, { DotsLoader } from '../elements/loader';
import { useMixpanel } from '@/lib/hooks';

const ProjectPopover = ({ project, deleteProject, updateName, setIsHovered }: {
  project: { slug: string, name: string },
  deleteProject: (clerkId: string, slug: string) => Promise<ActionResponseType>,
  updateName: (clerkId: string, slug: string, name: string) => Promise<ActionResponseType>
  setIsHovered: (hovered: boolean) => void,
}) => {
  const router = useRouter();
  const [newName, setNewName] = useState(project.name);
  const { user } = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nameInputDisabled, setNameInputDisabled] = useState(false);

  const handleNameSave = async () => {
    if (user && newName && updateName) {
      setNameInputDisabled(true);
      const res = await updateName(user.id, project.slug, newName);
      if (res.success) {
        setDialogOpen(false);
        router.refresh();
      } else {
        alert(res.error);
      }
      setNameInputDisabled(false);
    }
  };

  return <Popover>
    <PopoverTrigger asChild>
      <Button size="icon" variant="ghost"
        onMouseEnter={() => setIsHovered(false)}
        onMouseLeave={() => setIsHovered(true)}
        onTouchStart={() => setIsHovered(false)}
        onTouchEnd={() => setIsHovered(true)}
        onClick={(e) => e.stopPropagation()}
      >
        <Ellipsis className="w-4 h-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="flex flex-col gap-2 w-fit"
      onMouseEnter={() => setIsHovered(false)}
      onMouseLeave={() => setIsHovered(true)}
      onTouchStart={() => setIsHovered(false)}
      onTouchEnd={() => setIsHovered(true)}
      onClick={(e) => e.stopPropagation()}
    >
      <Button variant="ghost" onClick={() => router.push(`/project/${project.slug}`)}>
        <div className='flex items-center gap-2 w-full'>
          <ExternalLink className="w-4 h-4" />Open
        </div>
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <div className='flex items-center gap-2 w-full'>
              <Pencil className="w-4 h-4" />Rename
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Rename Project</DialogTitle>
          <DialogDescription>
            Enter a new name for your project
          </DialogDescription>
          <div className='flex flex-col gap-2'>
            <Input
              type="text"
              defaultValue={newName}
              disabled={nameInputDisabled}
              onChange={(e) => setNewName(e.target.value.trim())}
              onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
            />
            <div className='flex justify-end'>
              <Button onClick={handleNameSave} disabled={nameInputDisabled}>
                Send {nameInputDisabled ? <Loader /> : <SendHorizontal className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="destructive"
        onClick={() => {
          if (user) deleteProject(user.id, project.slug);
          router.refresh();
        }}
      >
        <div className='flex items-center gap-2 w-full'>
          <Trash2 className="w-4 h-4" />Delete
        </div>
      </Button>
    </PopoverContent>
  </Popover>
}

const ProjectCard = ({ project, deleteProject, updateName }: {
  project: { slug: string, name: string, payload: ControlsType },
  deleteProject: (clerkId: string, slug: string) => Promise<ActionResponseType>,
  updateName: (clerkId: string, slug: string, name: string) => Promise<ActionResponseType>
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    router.push(`/project/${project.slug}`);
  }

  return (
    <div
      key={project.slug}
      className={cn("relative cursor-pointer transition-colors flex flex-col gap-1 border p-2 pt-1 rounded-md w-[325px] h-[210px] overflow-hidden",
        isHovered && 'bg-muted',
        "transition-all duration-300 ease-out",
        "hover:translate-y-[-4px]",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className='flex w-full justify-between items-center'>
        <h2 className="truncate whitespace-nowrap min-h-8 flex-1">
          {project.name}
        </h2>
        <ProjectPopover project={project} deleteProject={deleteProject} updateName={updateName} setIsHovered={setIsHovered} />
      </div>
      <div className="w-full h-full">
        <Suspense fallback={<Skeleton className="w-full h-full bg-muted" />}>
          <TextTo3D
            controls={project.payload}
            frameloop="demand"
            orbitControlsEnabled={false}
            clickScreenShot={false}
            geometryRerenderKey={project.slug + project.name}
            zoom={0.25}
            className="w-full h-full pointer-events-none bg-transparent"
          />
        </Suspense>
      </div>
    </div>
  );
}

const NoProjects = () => {
  const router = useRouter();

  return <div className='cu-flex-center flex-col gap-2 p-2 h-full text-center'>
    <h2 className="text-lg font-semibold">No projects found</h2>
    <p className="text-sm text-muted-foreground">Create a new project to get started</p>
    <Button onClick={() => router.push('/project')} variant="outline" className='cu-shadow'>
      <CirclePlus className='w-4 h-4' /> New Project
    </Button>
  </div>
}

const Pagination = ({ currentPage, pageSize, projectsCount }: {
  currentPage: number,
  pageSize: number,
  projectsCount: number
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const searchParam = useMemo(() => params.get('search') ? `&search=${params.get('search')}` : "", [params]);

  const handleFirstPage = () => {
    router.push(`?page=1${searchParam}`);
  };
  const handlePreviousPage = () => {
    router.push(`?page=${Math.max(currentPage - 1, 1)}${searchParam}`);
  };
  const handleNextPage = () => {
    router.push(`?page=${Math.min(currentPage + 1, Math.ceil(projectsCount / pageSize))}${searchParam}`);
  };
  const handleLastPage = () => {
    router.push(`?page=${Math.ceil(projectsCount / pageSize)}${searchParam}`);
  };

  return (
    <div className='flex items-center gap-1'>
      <Button variant="outline" className='cu-shadow'
        title='Go to first page'
        disabled={currentPage === 1}
        onClick={handleFirstPage}
      >
        <ChevronsLeft />
      </Button>
      <Button variant="outline" size="icon" className='cu-shadow'
        title='Go to previous page'
        disabled={currentPage === 1}
        onClick={handlePreviousPage}
      >
        <ChevronLeft />
      </Button>
      <label className='px-2'>{currentPage} / {Math.ceil(projectsCount / pageSize)}</label>
      <Button variant="outline" size="icon" className='cu-shadow'
        title='Go to next page'
        disabled={currentPage === Math.ceil(projectsCount / pageSize)}
        onClick={handleNextPage}
      >
        <ChevronRight />
      </Button>
      <Button variant="outline" className='cu-shadow'
        title='Go to last page'
        disabled={currentPage === Math.ceil(projectsCount / pageSize)}
        onClick={handleLastPage}
      >
        <ChevronsRight />
      </Button>
    </div>
  );
}

const MyProjects = ({ projects, latestProjects, deleteProject, updateProjectName, projectsCount, currentPage, pageSize, showAllProjects = true }: {
  projects: { slug: string, name: string, payload: ControlsType }[],
  latestProjects: { slug: string, name: string, payload: ControlsType }[],
  deleteProject: (clerkId: string, slug: string) => Promise<ActionResponseType>,
  updateProjectName: (clerkId: string, slug: string, name: string) => Promise<ActionResponseType>,
  projectsCount: number,
  currentPage: number,
  pageSize: number,
  showAllProjects?: boolean
}) => {
  const router = useRouter();
  const params = useSearchParams();

  useMixpanel("my-projects", { projectsCount });

  useEffect(() => {
    const page = params.get('page') ?? "";
    if (page && projects.length === 0 && projectsCount !== 0) {
      const maxPage = Math.ceil(projectsCount / pageSize);
      const search = params.get('search') ?? "";
      if (search) {
        router.push(`?page=${maxPage}&search=${search}`);
      } else {
        router.push(`?page=${maxPage}`);
      }
    }
  }, [currentPage, pageSize, projectsCount, router]);

  if (projects.length === 0 && latestProjects.length === 0) {
    return <NoProjects />
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.trim();
    const page = params.get('page') ?? "";
    if (page && search) {
      router.push(`?page=${page}${search ? "&search=" + search : ""}`);
    } else if (search) {
      router.push(`?search=${search}`);
    } else if (page) {
      router.push(`?page=${page}`);
    } else {
      router.push("/my-projects");
    }
  }

  return (
    <div className="w-full max-w-5xl flex flex-col items-center gap-2">
      {latestProjects.length > 0 && <>
        <h1 className="text-xl font-bold w-full">Recent</h1>
        <div className={cn("w-full flex flex-wrap justify-center gap-2 select-none",
          latestProjects.length < 3 && "justify-start"
        )}
        >
          {latestProjects.map((project) => <ProjectCard
            key={project.slug}
            project={project}
            deleteProject={deleteProject}
            updateName={updateProjectName}
          />)}
        </div>
      </>}
      <Separator className='mt-2' />

      {showAllProjects && <>
        <div className='w-full flex items-center gap-2'>
          <h1 className="text-xl font-bold">All Projects</h1>
          <Button onClick={() => router.push('/project')} size="icon" variant="outline" className='cu-shadow'>
            <CirclePlus />
          </Button>
        </div>
        <Input type="search" placeholder="Search projects" className="w-full"
          defaultValue={params.get('search') ?? ""}
          onChange={handleSearch}
        />
        {projects.length === 0 ?
          projectsCount !== 0 ?
            <div className='h-10 cu-flex-center'>
              <DotsLoader />
            </div> : <div>
              No projects found
            </div> : <>
            <div className={cn("w-full flex flex-wrap justify-center gap-2 select-none",
              projects.length < 3 && "justify-start"
            )}
            >
              {projects.map((project) => <ProjectCard
                key={project.slug}
                project={project}
                deleteProject={deleteProject}
                updateName={updateProjectName}
              />)}
            </div>
            <Pagination currentPage={currentPage} pageSize={pageSize} projectsCount={projectsCount} />
          </>}
      </>}
    </div>
  );
};

export default MyProjects;
