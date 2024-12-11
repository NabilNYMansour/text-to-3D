"use client";

//=========={ Imports }==========//
import {
  Backdrop, Center, ContactShadows,
  Environment, EnvironmentProps,
  GradientTexture, GradientType,
  OrbitControls, Text3D
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { cloneElement, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Box, BrickWall, Camera, Download, Lightbulb, Pencil, Save, SendHorizontal, Settings, Theater, TriangleRight, X } from "lucide-react";
import PanelAccordion from "@/components/elements/panel-accordion";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ui/color-picker";
import { closeSiderbar, useDynamicDebouncedState } from "@/lib/hooks";
import GradientMaterial from "@/components/elements/gradient-material";
import MultiSelect from "@/components/elements/multi-select";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "../ui/skeleton";
import {
  ControlsType, defaultControls,
  environmentPresets, EnvironmentPresetType,
  environmentBackgrounds, environmentBackgroundsOrthographic, EnvironmentBackgroundType,
  materials,
  MaterialType,
  fonts,
  FontType
} from "@/lib/constants";
import { useClerk } from "@clerk/nextjs";
import { Input } from "../ui/input";
import LinkButton from "../buttons/link-button";
import { useDebouncedState } from "@mantine/hooks";
import dynamic from "next/dynamic";
import Loader, { FullPageLoader } from "../elements/loader";

//=========={ Save GLTF }==========//
function saveArrayBuffer(buffer: ArrayBuffer, fileName: string) {
  save(new Blob([buffer], { type: 'application/octet-stream' }), fileName)
}
function saveString(text: string, fileName: string) {
  save(new Blob([text], { type: 'text/plain' }), fileName)
}
function save(blob: Blob, fileName: string) {
  const link = document.createElement('a')
  link.style.display = 'none'
  document.body.appendChild(link)

  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()

  document.body.removeChild(link)
}
function exportGLTF(scene: THREE.Scene) {
  const gltfExporter = new GLTFExporter();
  gltfExporter.parse(
    scene,
    function (result) {
      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, 'threeTo3D.glb');
      } else {
        const output = JSON.stringify(result, null, 2);
        saveString(output, 'threeTo3D.gltf');
      }
    },
    function (error) {
      console.log('An error happened during parsing', error);
    },
  );

}

//=========={ Utils }==========//
const setCameraAspect = (camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, width: number, height: number) => {
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = width / height;
  }
  if (camera instanceof THREE.OrthographicCamera) {
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
  }
  camera.updateProjectionMatrix();
}

//=========={ Components }==========//
const InputComponent = ({ label, children, className }:
  { label: React.ReactNode, children?: React.ReactNode, className?: string }
) => {
  return (
    <div className={cn("w-full grid grid-cols-2 min-h-8 items-center", className)}>
      <label className="truncate whitespace-nowrap">
        {label}
      </label>
      <div className="flex items-center">
        {children}
      </div>
    </div>
  );
}
const ScreenshotComponent = ({ click, setClick, width, height }: {
  click: boolean,
  setClick: (value: boolean) => void,
  width: number,
  height: number
}) => {
  const { gl, scene, camera } = useThree();
  const getScreenShot = () => {
    const originalZoom = camera.zoom;
    const originalSize = new THREE.Vector2();
    gl.getSize(originalSize);

    gl.setSize(width, height);
    setCameraAspect(camera, width, height);
    if (camera instanceof THREE.OrthographicCamera) { // onlt for orthographic camera
      camera.zoom *= Math.min(width / originalSize.width, height / originalSize.height);
    }
    camera.updateProjectionMatrix();

    gl.render(scene, camera);
    const screenshot = gl.domElement.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = screenshot;
    link.download = "screenshot.png";
    link.click();
    link.remove();

    gl.setSize(originalSize.width, originalSize.height);
    setCameraAspect(camera, originalSize.width, originalSize.height);
    camera.zoom = originalZoom;
    camera.updateProjectionMatrix();
  }

  useEffect(() => {
    if (click) {
      getScreenShot();
      setClick(false);
    }
  }, [click]);

  return null;
}
const SceneObjects = ({ controls, textMeshRef, materialComponent }:
  {
    controls: any,
    textMeshRef: React.MutableRefObject<THREE.Mesh | null>,
    materialComponent: React.ReactElement
  }
) => {
  const font = useMemo(() => "/" + controls.font.replaceAll(" ", "") + ".json", [controls.font]);
  return <>
    <Center>
      <Text3D
        ref={textMeshRef}
        height={controls.height.value}
        bevelOffset={controls.bevelOffset.value}
        bevelSegments={controls.bevelSegments.value}
        curveSegments={controls.curveSegments.value}
        bevelEnabled={controls.bevelEnabled}
        bevelSize={controls.bevelSize.value}
        bevelThickness={controls.bevelThickness.value}
        lineHeight={controls.lineHeight.value}
        letterSpacing={controls.letterSpacing.value}
        size={controls.size.value}
        font={font}
        castShadow receiveShadow
      >
        {(controls.material === "Gradient Material" ? "\n" : "") // A quick hack to fix the gradient material
          + controls.text}
        {materialComponent}
      </Text3D>
    </Center>

    {controls.enableVerticalShadow && !controls.lightEnabled &&
      <ContactShadows
        opacity={0.25} scale={20} blur={1} far={10}
        resolution={256}
        color="#000000"
        position={[0, controls.verticalShadowOffset.value, 0]}
      />}

    {controls.backdropEnabled && <Backdrop
      floor={1}
      segments={20}
      receiveShadow
      scale={50}
      position={[0, -5, 0]}
    >
      <meshStandardMaterial
        color={controls.backdropColor}
        roughness={controls.backdropRoughness.value}
        metalness={controls.backdropMetalness.value}
      />
    </Backdrop>}
  </>
}
const SceneBackground = ({ controls }: { controls: any }) => {
  return <>
    {controls.background === "Gradient" &&
      <GradientTexture
        key={controls.background}
        attach="background"
        stops={[0, 1]}
        center={new THREE.Vector2(0.5, 0.5)}
        rotation={THREE.MathUtils.degToRad(controls.gradientAngle.value)}
        colors={[new THREE.Color(controls.backgroundColor), new THREE.Color(controls.secondBackgroundColor)]}
        type={GradientType.Linear}
      />}
    {controls.background === "Color" && <color
      attach="background"
      key={controls.background}
      args={[controls.backgroundColor]}
    />}
  </>
}

//=========={ Main App }==========//
type MainAppProps = {
  name?: string,
  updateName?: (clerkId: string, slug: string, name: string) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: boolean;
    error?: undefined;
  }>,
  slug?: string,
  initControls?: ControlsType
  updateControls?: (clerkId: string, slug: string, payload: ControlsType) => Promise<{
    error: string;
    success?: undefined;
  } | {
    success: boolean;
    error?: undefined;
  }>
};
const MainApp = ({ name, updateName, slug, initControls = defaultControls, updateControls }: MainAppProps) => {
  //=========={ close Sidebar }==========//
  closeSiderbar();

  //=========={ State and Refs }==========//
  const textMeshRef = useRef<THREE.Mesh | null>(null);
  const [clickScreenShot, setClickScreenShot] = useState(false);
  const [screenshotResolution, setScreenshotResolution] = useState({ width: 1920, height: 1080 });

  //=========={ Clerk }==========//
  const { user } = useClerk();

  //=========={ Controls }==========//
  const [controls, setControls, setControlsDebounced] = useDynamicDebouncedState<ControlsType>(initControls, 100);

  //=========={ Export GLTF }==========//
  const handleExport = () => {
    if (!textMeshRef.current) return;
    const exportScene = new THREE.Scene();
    const textMesh = textMeshRef.current.clone();
    if (controls.material === "Normal Material") {
      textMesh.material = new THREE.MeshStandardMaterial();
    }
    exportScene.add(textMesh);
    exportGLTF(exportScene);
  }

  //=========={ Material }==========//
  const material = useMemo(() => {
    switch (controls.material) {
      case "Normal Material":
        return <meshNormalMaterial />;
      case "Standard Material":
        return <meshStandardMaterial color={controls.color} metalness={controls.metalness.value} roughness={controls.roughness.value} />;
      case "Gradient Material":
        return <GradientMaterial color={controls.color} secondColor={controls.secondColor} colorOnly={controls.colorOnly} metalness={controls.metalness.value} roughness={controls.roughness.value} />;
      case "Wireframe Material":
        return <meshBasicMaterial wireframe color={controls.color} />;
      case "Basic Material":
        return <meshBasicMaterial color={controls.color} />;
      default:
        return <meshNormalMaterial />;
    }
  }, [controls.material]);
  const materialComponent = useMemo(() => {
    return cloneElement(material, {
      color: controls.color,
      secondColor: controls.secondColor,
      roughness: controls.roughness.value,
      metalness: controls.metalness.value,
      colorOnly: controls.colorOnly,
    });
  }, [material, controls.color, controls.secondColor, controls.roughness.value, controls.metalness.value, controls.colorOnly]);
  // Error due to using memoized state inside the panel. This fixes it.
  const [materialPanelOpened, setMaterialPanelOpened] = useState(controls.panels.material.opened);
  useEffect(() => setControls({ ...controls, panels: { ...controls.panels, material: { opened: materialPanelOpened } } }), [materialPanelOpened]);

  //=========={ Geometry rerender key }==========//
  const geometryRerenderKey = useMemo(() => {
    return controls.text + controls.height.value + controls.font + controls.curveSegments.value + controls.size.value
      + controls.bevelEnabled + controls.bevelOffset.value + controls.bevelSegments.value + controls.bevelSize.value + controls.bevelThickness.value
      + controls.lineHeight.value + controls.letterSpacing.value + controls.material
  }, [
    controls.text, controls.font, controls.height.value, controls.curveSegments.value, controls.size.value,
    controls.bevelEnabled, controls.bevelOffset.value, controls.bevelSegments.value, controls.bevelSize.value, controls.bevelThickness.value,
    controls.lineHeight.value, controls.letterSpacing.value, controls.material
  ]);

  //=========={ Client Side Actions }==========//
  const sceneActionsComponent = useMemo(() => {
    return <div className="absolute z-[1] flex items-center justify-between left-0 top-0 m-6 gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button title="Screenshot">
            <Download className="w-4 h-4" /> Export
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          <h1 className="flex items-center gap-1"><Camera className="w-4 h-4" />Screenshot</h1>
          <Button className="grid grid-cols-2 w-full" size="lg"
            onClick={() => {
              setScreenshotResolution({ width: 1920, height: 1080 });
              setClickScreenShot(true);
            }}
          >
            <div className="flex">PNG HD</div>
            <div>1920 x 1080</div>
          </Button>

          <Button className="grid grid-cols-2 w-full" size="lg"
            onClick={() => {
              setScreenshotResolution({ width: 3840, height: 2160 });
              setClickScreenShot(true);
            }}
          >
            <div className="flex">PNG 4K</div>
            <div>3840 x 2160</div>
          </Button>

          <Button className="grid grid-cols-2 w-full" size="lg"
            onClick={() => {
              setScreenshotResolution({ width: 7680, height: 4320 });
              setClickScreenShot(true);
            }}
          >
            <div className="flex">PNG 8K</div>
            <div>7680 x 4320</div>
          </Button>

          <h1 className="flex items-center gap-1 mt-2"><Box className="w-4 h-4" /> 3D Model</h1>
          <Button onClick={handleExport}>
            Download GLTF
          </Button>

        </PopoverContent>
      </Popover>
    </div>
  }, [handleExport]);

  //=========={ Server Side Actions }==========//
  const [newName, setNewName] = useState(name);
  const [editingName, setEditingName] = useState(false);
  const [backendLoading, setBackendLoading] = useState(false);
  const [cannotSave, setCannotSave] = useState(false);

  useEffect(() => {
    setCannotSave(JSON.stringify(controls) === JSON.stringify(initControls));
  }, [controls]);

  useEffect(() => {
    const handleAutosave = async () => {
      if (updateControls && !cannotSave && user && slug) {
        setBackendLoading(true);
        const res = await updateControls(user.id, slug, controls);
        if (res.success) {
          setBackendLoading(false);
          setCannotSave(true);
        }
      }
    };

    const autosaveInterval = setInterval(handleAutosave, 5000); // Autosave every 5 seconds

    return () => clearInterval(autosaveInterval);
  }, [controls, cannotSave, updateControls, user, slug]);

  const sceneNameComponent = useMemo(() => {
    if (!name || !slug || !user) {
      return (
        <div className="flex w-full">
          <LinkButton href="/sign-in" variant="outline" className="cu-shadow">
            Sign in
          </LinkButton>
        </div>
      );
    }

    const handleNameSave = async () => {
      setEditingName(false);
      if (newName && updateName) {
        setBackendLoading(true);
        const res = await updateName(user.id, slug, newName);
        if (res.success) setBackendLoading(false);
      }
    };

    const handleControlsSave = async () => {
      if (updateControls) {
        setBackendLoading(true);
        const res = await updateControls(user.id, slug, controls);
        if (res.success) {
          setBackendLoading(false);
          setCannotSave(true);
        }
      }
    }

    return (
      <div className="w-full flex justify-between items-center select-text gap-2">
        {editingName ? (
          <>
            <div>
              <Button variant="destructive" size="icon" onClick={() => setEditingName(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Input
              type="text"
              defaultValue={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSave();
                if (e.key === "Escape") setEditingName(false);
              }}
            />
            <div>
              <Button variant="outline" size="icon" className="cu-shadow" onClick={handleNameSave}>
                <SendHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-lg font-bold truncate whitespace-nowrap">
              {newName}
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" className="cu-shadow" size="icon" onClick={() => setEditingName(true)} disabled={backendLoading}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="cu-shadow" size="icon" onClick={handleControlsSave} disabled={cannotSave || backendLoading}>
                {backendLoading ? <Loader size={16} /> : <Save className="w-4 h-4" />}
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }, [name, slug, user, newName, editingName, backendLoading, updateName, updateControls, controls, cannotSave]);

  //=========={ Render }==========//
  return (
    <div className="flex-1 select-none max-h-[calc(100vh-52px)] w-full flex bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-5 flex-col md:flex-row">
      <div className="md:w-[20%] overflow-auto bg-background p-2 m-4 mb-0 md:mb-4 md:mr-0 rounded-md flex flex-col gap-2 items-center transition-transform">
        {/* //=========={ Scene name }==========// */}
        {sceneNameComponent}

        {/* //=========={ General Panel }==========// */}
        <PanelAccordion opened={controls.panels.general.opened}
          onPanelChange={(opened) => setControls({ ...controls, panels: { ...controls.panels, general: { opened } } })}
          title={<div className="cu-flex-center gap-2">
            <Settings className="w-4 h-4" />
            <label className="text-base hover:cursor-pointer">
              General
            </label>
          </div>}
        >
          <div className="flex flex-col gap-4">
            <InputComponent label="Text" className="flex flex-col gap-1 items-stretch">
              <Textarea className="w-full" value={controls.text} onChange={(e) => setControls({ ...controls, text: e.target.value })} />
            </InputComponent>
            <InputComponent label="Font">
              <MultiSelect value={controls.font}
                onChange={(value) => setControls({ ...controls, font: value as FontType })}
                options={fonts as unknown as string[]}
              />
            </InputComponent>
            <InputComponent label="Extrustion">
              <Slider min={0.1} max={10} step={0.1} defaultValue={[controls.height.value]}
                onValueChange={(value) => setControlsDebounced({ ...controls, height: { ...controls.height, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Curve Segments">
              <Slider
                min={1}
                max={32}
                step={1}
                defaultValue={[controls.curveSegments.value]}
                onValueChange={(value) => setControlsDebounced({ ...controls, curveSegments: { ...controls.curveSegments, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Size">
              <Slider
                min={0.1}
                max={10}
                step={0.1}
                defaultValue={[controls.size.value]}
                onValueChange={(value) => setControlsDebounced({ ...controls, size: { ...controls.size, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Line Height">
              <Slider
                min={0}
                max={2}
                step={0.01}
                defaultValue={[controls.lineHeight.value]}
                onValueChange={(value) => setControlsDebounced({ ...controls, lineHeight: { ...controls.lineHeight, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Letter Spacing">
              <Slider
                min={-1}
                max={1}
                step={0.01}
                defaultValue={[controls.letterSpacing.value]}
                onValueChange={(value) => setControlsDebounced({ ...controls, letterSpacing: { ...controls.letterSpacing, value: value[0] } })}
              />
            </InputComponent>
          </div>
        </PanelAccordion>

        {/* //=========={ Material Panel }==========// */}
        <PanelAccordion opened={controls.panels.material.opened}
          onPanelChange={(opened) => setMaterialPanelOpened(opened)}
          title={<div className="cu-flex-center gap-2">
            <BrickWall className="w-4 h-4" />
            <label className="text-base hover:cursor-pointer">
              Material
            </label>
          </div>}
        >
          <InputComponent label="Type">
            <MultiSelect value={controls.material}
              onChange={(value) => setControls({ ...controls, material: value as MaterialType })}
              options={materials as unknown as string[]}
            />
          </InputComponent>
          {controls.material === "Gradient Material" &&
            <InputComponent label="Shading Only">
              <Switch checked={controls.colorOnly} onCheckedChange={(checked) => setControls({ ...controls, colorOnly: checked })} />
            </InputComponent>}
          {material.props.color &&
            <InputComponent label="Color">
              <ColorPicker value={controls.color} onChange={(value) => setControls({ ...controls, color: value })} />
            </InputComponent>}
          {material.props.secondColor &&
            <InputComponent label="Color 2">
              <ColorPicker value={controls.secondColor} onChange={(value) => setControls({ ...controls, secondColor: value })} />
            </InputComponent>}
          {material.props.roughness &&
            <InputComponent label="Roughness">
              <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={[controls.roughness.value]}
                onValueChange={(value) => setControls({ ...controls, roughness: { ...controls.roughness, value: value[0] } })}
              />
            </InputComponent>}
          {material.props.metalness &&
            <InputComponent label="Metalness">
              <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={[controls.metalness.value]}
                onValueChange={(value) => setControls({ ...controls, metalness: { ...controls.metalness, value: value[0] } })}
              />
            </InputComponent>}
        </PanelAccordion>

        {/* //=========={ Bevel Panel }==========// */}
        <PanelAccordion opened={controls.panels.bevel.opened}
          onPanelChange={(opened) => setControls({ ...controls, panels: { ...controls.panels, bevel: { opened } } })}
          title={<div className="cu-flex-center gap-2">
            <TriangleRight className="w-4 h-4" />
            <label className="text-base hover:cursor-pointer">
              Bevel
            </label>
          </div>}
        >
          <div className="flex flex-col gap-4">
            <InputComponent label="Bevel Enabled">
              <Switch checked={controls.bevelEnabled} onCheckedChange={(checked) => setControls({ ...controls, bevelEnabled: checked })} />
            </InputComponent>
            <InputComponent label="Offset">
              <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={[controls.bevelOffset.value]}
                onValueChange={(value) => setControlsDebounced({ ...controls, bevelOffset: { ...controls.bevelOffset, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Segments">
              <Slider
                min={1}
                max={32}
                step={1}
                defaultValue={[controls.bevelSegments.value]}
                onValueChange={(value) => setControlsDebounced({ ...controls, bevelSegments: { ...controls.bevelSegments, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Size">
              <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={[controls.bevelSize.value]}
                onValueChange={(value) => setControlsDebounced({ ...controls, bevelSize: { ...controls.bevelSize, value: value[0] } })}
              />
            </InputComponent>
            <InputComponent label="Thickness">
              <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={[controls.bevelThickness.value]}
                onValueChange={(value) => setControlsDebounced({ ...controls, bevelThickness: { ...controls.bevelThickness, value: value[0] } })}
              />
            </InputComponent>
          </div>
        </PanelAccordion>

        {/* //=========={ Light Panel }==========// */}
        <PanelAccordion opened={controls.panels.light.opened}
          onPanelChange={(opened) => setControls({ ...controls, panels: { ...controls.panels, light: { opened } } })}
          title={<div className="cu-flex-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <label className="text-base hover:cursor-pointer">
              Light
            </label>
          </div>}
        >
          <div className="flex flex-col gap-4">
            <InputComponent label="Light Enabled">
              <Switch checked={controls.lightEnabled} onCheckedChange={(checked) => setControls({ ...controls, lightEnabled: checked })} />
            </InputComponent>
            {controls.lightEnabled ? <>
              <InputComponent label="Intensity">
                <Slider
                  min={0}
                  max={2}
                  step={0.01}
                  defaultValue={[controls.light.intensity]}
                  onValueChange={(value) => setControls({ ...controls, light: { ...controls.light, intensity: value[0] } })}
                />
              </InputComponent>
              <InputComponent label="Color">
                <ColorPicker value={controls.light.color} onChange={(value) => setControls({ ...controls, light: { ...controls.light, color: value } })} />
              </InputComponent>
              <InputComponent label="Light X position">
                <Slider
                  min={controls.light.minMax[0][0]}
                  max={controls.light.minMax[0][1]}
                  step={controls.light.step}
                  defaultValue={[controls.light.position[0]]}
                  onValueChange={(value) => setControls({ ...controls, light: { ...controls.light, position: [value[0], controls.light.position[1], controls.light.position[2]] } })}
                />
              </InputComponent>
              <InputComponent label="Light Y position">
                <Slider
                  min={controls.light.minMax[1][0]}
                  max={controls.light.minMax[1][1]}
                  step={controls.light.step}
                  defaultValue={[controls.light.position[1]]}
                  onValueChange={(value) => setControls({ ...controls, light: { ...controls.light, position: [controls.light.position[0], value[0], controls.light.position[2]] } })}
                />
              </InputComponent>
              <InputComponent label="Light Z position">
                <Slider
                  min={controls.light.minMax[2][0]}
                  max={controls.light.minMax[2][1]}
                  step={controls.light.step}
                  defaultValue={[controls.light.position[2]]}
                  onValueChange={(value) => setControls({ ...controls, light: { ...controls.light, position: [controls.light.position[0], controls.light.position[1], value[0]] } })}
                />
              </InputComponent>
            </> : <>
              <InputComponent label="Enable Shadow">
                <Switch checked={controls.enableVerticalShadow} onCheckedChange={(checked) => setControls({ ...controls, enableVerticalShadow: checked })} />
              </InputComponent>
              {controls.enableVerticalShadow &&
                <InputComponent label="Shadow Offset">
                  <Slider
                    min={-10}
                    max={0}
                    step={0.1}
                    defaultValue={[controls.verticalShadowOffset.value]}
                    onValueChange={(value) => setControls({ ...controls, verticalShadowOffset: { ...controls.verticalShadowOffset, value: value[0] } })}
                  />
                </InputComponent>}
            </>}
          </div>
        </PanelAccordion>

        {/* //=========={ Scene Panel }==========// */}
        <PanelAccordion opened={controls.panels.scene.opened}
          onPanelChange={(opened) => setControls({ ...controls, panels: { ...controls.panels, scene: { opened } } })}
          title={<div className="cu-flex-center gap-2">
            <Theater className="w-4 h-4" />
            <label className="text-base hover:cursor-pointer">
              Scene
            </label>
          </div>}
        >
          <div className="flex flex-col gap-4">
            <InputComponent label="Perspective Camera">
              <Switch checked={controls.perspective} onCheckedChange={(checked) => setControls({ ...controls, perspective: checked })} />
            </InputComponent>
            <InputComponent label="Enviroment">
              <MultiSelect value={controls.preset}
                onChange={(value) => setControls({ ...controls, preset: value as EnvironmentPresetType })}
                options={environmentPresets as unknown as string[]}
              />
            </InputComponent>
            <InputComponent label="Background">
              <MultiSelect value={controls.background}
                onChange={(value) => setControls({ ...controls, background: value as EnvironmentBackgroundType })}
                options={controls.perspective ? environmentBackgrounds as unknown as string[] : environmentBackgroundsOrthographic as unknown as string[]}
              />
            </InputComponent>
            {(controls.background === "Color" || controls.background === "Gradient") &&
              <InputComponent label="Color">
                <div className="flex gap-1">
                  {/* <ColorPicker withTextInput={!material.props.secondColor} value={controls.color} onChange={(value) => setControls({ ...controls, color: value })} /> */}
                  <ColorPicker value={controls.backgroundColor} onChange={(value) => setControls({ ...controls, backgroundColor: value })} />
                  {/* {material.props.secondColor &&
                    <ColorPicker withTextInput={false} value={controls.secondColor} onChange={(value) => setControls({ ...controls, secondColor: value })} />} */}
                </div>
              </InputComponent>}
            {controls.background === "Gradient" &&
              <InputComponent label="Color 2">
                <ColorPicker value={controls.secondBackgroundColor} onChange={(value) => setControls({ ...controls, secondBackgroundColor: value })} />
              </InputComponent>}
            {controls.background === "Gradient" &&
              <InputComponent label="Angle">
                <Slider
                  min={controls.gradientAngle.min}
                  max={controls.gradientAngle.max}
                  step={controls.gradientAngle.step}
                  defaultValue={[controls.gradientAngle.value]}
                  onValueChange={(value) => setControls({ ...controls, gradientAngle: { ...controls.gradientAngle, value: value[0] } })}
                />
              </InputComponent>}
            <InputComponent label="Backdrop Enabled">
              <Switch checked={controls.backdropEnabled} onCheckedChange={(checked) => setControls({ ...controls, backdropEnabled: checked })} />
            </InputComponent>
            {controls.backdropEnabled &&
              <>
                <InputComponent label="Color">
                  <ColorPicker value={controls.backdropColor} onChange={(value) => setControls({ ...controls, backdropColor: value })} />
                </InputComponent>
                <InputComponent label="Roughness">
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={[controls.backdropRoughness.value]}
                    onValueChange={(value) => setControls({ ...controls, backdropRoughness: { ...controls.backdropRoughness, value: value[0] } })}
                  />
                </InputComponent>
                <InputComponent label="Metalness">
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={[controls.backdropMetalness.value]}
                    onValueChange={(value) => setControls({ ...controls, backdropMetalness: { ...controls.backdropMetalness, value: value[0] } })}
                  />
                </InputComponent>
              </>}
          </div>
        </PanelAccordion>
      </div>

      <div className="relative h-[100%] min-h-[50vh] md:w-[80%] p-4 cu-flex-center flex-col gap-2">
        {/* //=========={ Scene }==========// */}
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          {sceneActionsComponent}
          <Canvas shadows
            className="rounded-md bg-background transition-opacity duration-300"
            gl={{ preserveDrawingBuffer: true }}
            frameloop="always"
            camera={controls.perspective ? { zoom: 1 } : { zoom: 100, near: -1000, far: 1000 }}
            orthographic={!controls.perspective}
            key={controls.perspective ? "perspective" : "orthographic"}
            style={{ opacity: clickScreenShot ? 0 : 1 }}
          >
            {/* //=========={ Screenshot }==========// */}
            <ScreenshotComponent
              click={clickScreenShot} setClick={setClickScreenShot}
              width={screenshotResolution.width} height={screenshotResolution.height}
            />

            {/* //=========={ Background }==========// */}
            <SceneBackground controls={controls} />

            {/* //=========={ Scene Objects }==========// */}
            <SceneObjects key={geometryRerenderKey} controls={controls} textMeshRef={textMeshRef} materialComponent={materialComponent} />

            {/* //=========={ Environment and Light }==========// */}
            <Environment
              key={controls.preset}
              preset={controls.preset.toLowerCase() as EnvironmentProps["preset"]}
              extensions={(loader: any) => loader.setDataType(THREE.FloatType)}
              background={controls.background === "Environment" && controls.perspective}
            />
            {controls.lightEnabled && <directionalLight castShadow
              intensity={controls.light.intensity}
              color={controls.light.color}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              position={controls.light.position as [number, number, number]}
            />}

            {/* //=========={ Orbit Controls }==========// */}
            <OrbitControls makeDefault />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MainApp), {
  ssr: false,
  loading: () => <FullPageLoader />
});


//=========={ !!!TEST!!! }==========//
// import { convertFontToJson } from "@/lib/facetype";

// useEffect(() => {
//   const test = async () => {
//     const fontUrl = "/NotoEmoji.ttf"; // URL to the font in the public folder
//     const response = await fetch(fontUrl);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch font file: ${response.statusText}`);
//     }

//     const fontBuffer = await response.arrayBuffer();
//     const fontFile = new File([fontBuffer], "font.ttf");

//     convertFontToJson(fontFile, { jsonFormat: true })
//       .then((json) => {
//         console.log(json); // Use or save the JSON string
//       })
//       .catch((err) => {
//         console.error("Error converting font:", err);
//       });
//   }
//   test();
// }, []);