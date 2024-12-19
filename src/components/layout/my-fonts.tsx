"use client";

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import Loader, { FullPageLoader } from '../elements/loader';
import { Button } from '../ui/button';
import { Pencil, SendHorizontal, Trash2 } from 'lucide-react';
import { ActionResponseType } from '@/lib/constants-and-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '../ui/input';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import AddFontDialog from '../elements/add-font-dialog';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls, Text3D } from '@react-three/drei';
import { Skeleton } from '../ui/skeleton';

const MyFonts = ({ fonts, changeFontName, deleteFont }: {
  fonts: { name: string, url: string }[],
  changeFontName: (clerkId: string, url: string, name: string) => Promise<ActionResponseType>,
  deleteFont: (clerkId: string, url: string) => Promise<ActionResponseType>,
}) => {
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [newName, setNewName] = useState(selectedFont.name);
  const [nameInputDisabled, setNameInputDisabled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialog3DOpen, setDialog3DOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handleNameSave = async () => {
    if (user && newName) {
      setNameInputDisabled(true);
      const res = await changeFontName(user.id, selectedFont.url, newName);
      if (res.success) {
        setDialogOpen(false);
        router.refresh();
      } else {
        alert(res.error);
      }
      setNameInputDisabled(false);
    }
  };
  const handleFontDelete = async (fontUrl: string) => {
    if (user) {
      const res = await deleteFont(user.id, fontUrl);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error);
      }
    }
  }

  return <div className="w-full max-w-5xl h-full flex flex-col items-center gap-2 p-4">
    <div className='w-full'>
      <div className='cu-flex-center gap-2 w-fit'>
        <h1 className="text-xl font-bold w-full">
          Fonts
        </h1>
        <div>
          <AddFontDialog onUploadComplete={() => router.refresh()} />
        </div>
      </div>
    </div>
    <div className='grid w-full'>
      <div className="w-full grid gap-2 items-center overflow-scroll">
        {fonts.map((font, index) => (
          <div className='truncate flex gap-2 h-full overflow-hidden' key={index}>
            <div onClick={() => {
              setSelectedFont(font);
              setDialog3DOpen(true);
            }}
              className='flex-1 border cu-shadow hover:bg-muted p-2 rounded-md hover:cursor-pointer transition-colors truncate'
            >
              {font.name}
            </div>
            <div className='flex items-center gap-2'>
              <Button size="icon" variant="destructive" onClick={() => handleFontDelete(font.url)}>
                <Trash2 />
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="secondary" onClick={() => setSelectedFont(font)}>
                    <Pencil />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Rename Font</DialogTitle>
                  <DialogDescription>Enter a new name for the font</DialogDescription>
                  <div className='flex flex-col gap-2'>
                    <Input
                      type="text"
                      defaultValue={selectedFont.name}
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
            </div>
          </div>
        ))}
      </div>
    </div>
    <Dialog open={dialog3DOpen} onOpenChange={setDialog3DOpen} key={selectedFont.url}>
      <DialogContent className='max-w-[90vw] h-[90vh]'>
        <DialogTitle hidden>3D Preview</DialogTitle>
        <DialogDescription hidden>Preview of the font in 3D</DialogDescription>
        <Suspense fallback={<Skeleton className='w-full h-full bg-muted' />}>
          <Canvas camera={{ zoom: 80, near: -1000, far: 1000 }} orthographic>
            <directionalLight position={[10, 10, 10]} />
            <Center>
              <Text3D font={selectedFont.url}>
                {selectedFont.name}
                <meshStandardMaterial attach="material" color="white" />
              </Text3D>
            </Center>
            <OrbitControls makeDefault enablePan={false} enableZoom={true} />
          </Canvas>
        </Suspense>
      </DialogContent>
    </Dialog>
  </div >
};

export const NoFonts = () => {
  const router = useRouter();

  return <div className='cu-flex-center flex-col gap-2 mt-8 p-2 h-full text-center'>
    <h2 className="text-lg font-semibold">No fonts found</h2>
    <p className="text-sm text-muted-foreground">You don&apos;t have any fonts yet. Upload a font to get started</p>
    <AddFontDialog withButtonText onUploadComplete={() => router.refresh()} />
  </div>
}

export default dynamic(() => Promise.resolve(MyFonts), {
  ssr: false,
  loading: () => <FullPageLoader />,
});